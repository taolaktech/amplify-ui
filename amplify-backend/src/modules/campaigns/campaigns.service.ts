import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Campaign, CampaignDocument, ProductData } from './schemas/campaign.schema';
import { Creative, CreativeDocument } from './schemas/creative.schema';
import { CreditsService } from '../credits/credits.service';
import { TemplatesService } from '../templates/templates.service';
import { GeminiService } from '../ai/gemini.service';
import { StorageService } from '../storage/storage.service';
import { AuditService } from '../audit/audit.service';
import { CreateCampaignDto } from './dto';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectModel(Campaign.name)
    private campaignModel: Model<CampaignDocument>,
    @InjectModel(Creative.name)
    private creativeModel: Model<CreativeDocument>,
    private creditsService: CreditsService,
    private templatesService: TemplatesService,
    private geminiService: GeminiService,
    private storageService: StorageService,
    private auditService: AuditService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(
    createCampaignDto: CreateCampaignDto,
    userId: string,
  ): Promise<Campaign> {
    const templateIds = createCampaignDto.templateIds.map(
      (id) => new Types.ObjectId(id),
    );

    // Validate templates exist and are active
    for (const templateId of createCampaignDto.templateIds) {
      const template = await this.templatesService.findById(templateId);
      if (template.status !== 'active') {
        throw new BadRequestException(
          `Template ${templateId} is not active. Please parse it first.`,
        );
      }
    }

    const campaign = new this.campaignModel({
      userId,
      name: createCampaignDto.name,
      products: createCampaignDto.products,
      templates: templateIds,
      status: 'draft',
      metadata: createCampaignDto.metadata,
    });

    const saved = await campaign.save();

    await this.auditService.log({
      userId,
      action: 'CREATE',
      resource: 'campaign',
      resourceId: saved._id.toString(),
      details: {
        templateCount: templateIds.length,
        productCount: createCampaignDto.products.length,
      },
    });

    this.logger.info('Campaign created', {
      campaignId: saved._id,
      userId,
    });

    return saved;
  }

  async findById(id: string, userId: string): Promise<Campaign> {
    const campaign = await this.campaignModel
      .findById(id)
      .populate('templates')
      .populate('creatives')
      .exec();

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    if (campaign.userId !== userId) {
      throw new ForbiddenException('You do not have access to this campaign');
    }

    return campaign;
  }

  async findAllByUser(
    userId: string,
    status?: string,
    page = 1,
    limit = 20,
  ): Promise<{ campaigns: Campaign[]; total: number; pages: number }> {
    const query: any = { userId };
    if (status) {
      query.status = status;
    }

    const [campaigns, total] = await Promise.all([
      this.campaignModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('templates')
        .exec(),
      this.campaignModel.countDocuments(query),
    ]);

    return {
      campaigns,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async generate(campaignId: string, userId: string): Promise<Campaign> {
    const campaign = await this.findById(campaignId, userId);

    if (campaign.status === 'generating') {
      throw new BadRequestException('Campaign is already being generated');
    }

    if (campaign.status === 'generated') {
      throw new BadRequestException('Campaign has already been generated');
    }

    // Calculate required credits
    const templates = await Promise.all(
      campaign.templates.map((t: any) =>
        this.templatesService.findById(t._id?.toString() || t.toString()),
      ),
    );

    let requiredCredits = 0;
    const creativesToGenerate: Array<{
      template: any;
      product: ProductData;
      credits: number;
    }> = [];

    for (const template of templates) {
      for (const product of campaign.products) {
        const credits = template.type === 'video' ? 3 : 1;
        requiredCredits += credits;
        creativesToGenerate.push({ template, product, credits });
      }
    }

    // Check if user has enough credits
    const hasCredits = await this.creditsService.hasEnoughCredits(
      userId,
      requiredCredits,
    );

    if (!hasCredits) {
      throw new BadRequestException(
        `Insufficient credits. Required: ${requiredCredits}`,
      );
    }

    // Update campaign status
    await this.campaignModel
      .findByIdAndUpdate(campaignId, { status: 'generating' })
      .exec();

    this.logger.info('Starting campaign generation', {
      campaignId,
      creativesToGenerate: creativesToGenerate.length,
      requiredCredits,
    });

    try {
      const createdCreatives: Creative[] = [];
      let totalCreditsUsed = 0;

      for (const { template, product, credits } of creativesToGenerate) {
        // Create creative record
        const creative = new this.creativeModel({
          campaignId: new Types.ObjectId(campaignId),
          templateId: template._id,
          type: template.type,
          creditsUsed: credits,
          status: 'generating',
          productData: product,
        });

        const savedCreative = await creative.save();

        try {
          // Generate the creative using Gemini
          const generated = await this.geminiService.generateCreative(
            template.parsedJson,
            {
              productImage: product.productImage,
              productName: product.productName,
              description: product.description,
              price: product.price,
              cta: product.cta,
            },
            template.sourceS3Url,
          );

          // Upload to S3 if we have actual image data
          let outputS3Url = '';
          let outputS3Key = '';

          if (generated.base64Data) {
            const buffer = Buffer.from(generated.base64Data, 'base64');
            const key = `creatives/${campaignId}/${savedCreative._id}.${
              template.type === 'video' ? 'mp4' : 'png'
            }`;

            const uploadResult = await this.storageService.uploadFile(
              buffer,
              key,
              generated.mimeType,
            );

            outputS3Url = uploadResult.url;
            outputS3Key = key;
          }

          // Update creative with result
          await this.creativeModel
            .findByIdAndUpdate(savedCreative._id, {
              status: 'completed',
              outputS3Url,
              outputS3Key,
              generationMetadata: generated.metadata,
            })
            .exec();

          // Deduct credits
          await this.creditsService.deductCredits(
            userId,
            credits,
            `Creative generation for campaign ${campaignId}`,
          );

          totalCreditsUsed += credits;
          createdCreatives.push(savedCreative);

          this.logger.info('Creative generated', {
            creativeId: savedCreative._id,
            campaignId,
          });
        } catch (error: any) {
          // Mark creative as failed
          await this.creativeModel
            .findByIdAndUpdate(savedCreative._id, {
              status: 'failed',
              errorMessage: error.message,
            })
            .exec();

          this.logger.error('Creative generation failed', {
            creativeId: savedCreative._id,
            error: error.message,
          });
        }
      }

      // Update campaign with results
      const updatedCampaign = await this.campaignModel
        .findByIdAndUpdate(
          campaignId,
          {
            status: 'generated',
            creatives: createdCreatives.map((c: any) => c._id),
            totalCreditsUsed,
          },
          { new: true },
        )
        .populate('templates')
        .populate('creatives')
        .exec();

      await this.auditService.log({
        userId,
        action: 'GENERATE',
        resource: 'campaign',
        resourceId: campaignId,
        details: {
          creativesGenerated: createdCreatives.length,
          totalCreditsUsed,
        },
      });

      this.logger.info('Campaign generation completed', {
        campaignId,
        creativesGenerated: createdCreatives.length,
        totalCreditsUsed,
      });

      return updatedCampaign!;
    } catch (error: any) {
      await this.campaignModel
        .findByIdAndUpdate(campaignId, {
          status: 'failed',
          errorMessage: error.message,
        })
        .exec();

      this.logger.error('Campaign generation failed', {
        campaignId,
        error: error.message,
      });

      throw error;
    }
  }

  async delete(id: string, userId: string): Promise<void> {
    const campaign = await this.findById(id, userId);

    // Delete associated creatives
    await this.creativeModel.deleteMany({ campaignId: (campaign as any)._id }).exec();

    // Delete campaign
    await this.campaignModel.findByIdAndDelete(id).exec();

    await this.auditService.log({
      userId,
      action: 'DELETE',
      resource: 'campaign',
      resourceId: id,
    });

    this.logger.info('Campaign deleted', { campaignId: id });
  }

  async getCreatives(campaignId: string, userId: string): Promise<Creative[]> {
    await this.findById(campaignId, userId); // Verify access

    return this.creativeModel
      .find({ campaignId: new Types.ObjectId(campaignId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async estimateCredits(
    templateIds: string[],
    productCount: number,
  ): Promise<{ total: number; breakdown: { image: number; video: number } }> {
    let imageCredits = 0;
    let videoCredits = 0;

    for (const templateId of templateIds) {
      const template = await this.templatesService.findById(templateId);
      if (template.type === 'video') {
        videoCredits += 3 * productCount;
      } else {
        imageCredits += 1 * productCount;
      }
    }

    return {
      total: imageCredits + videoCredits,
      breakdown: {
        image: imageCredits,
        video: videoCredits,
      },
    };
  }
}
