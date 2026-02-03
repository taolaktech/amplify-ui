import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CreateGenerationDto } from './dto/create-generation.dto';
import {
  Generation,
  GenerationDocument,
  GenerationStatus,
} from './schemas/generation.schema';
import { TemplatesService } from '../templates/templates.service';
import { StorageService } from '../storage/storage.service';
import { CreditsService } from '../credits/credits.service';

const COST_BY_MODE: Record<'standard' | 'pro', number> = {
  standard: 38,
  pro: 76,
};

@Injectable()
export class GenerationsService {
  constructor(
    @InjectModel(Generation.name)
    private generationModel: Model<GenerationDocument>,
    private templatesService: TemplatesService,
    private storageService: StorageService,
    private creditsService: CreditsService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(dto: CreateGenerationDto, userId: string) {
    const cost = COST_BY_MODE[dto.mode];
    const hasCredits = await this.creditsService.hasEnoughCredits(userId, cost);
    if (!hasCredits) {
      throw new BadRequestException(`Insufficient credits. Required: ${cost}`);
    }

    const generation = await this.generationModel.create({
      userId,
      productKitId: dto.productKitId,
      templateId: dto.templateId,
      mode: dto.mode,
      status: 'queued' as GenerationStatus,
    });

    // Fire-and-forget async pipeline (MVP)
    this.runPipeline(generation._id.toString(), userId).catch((error: any) => {
      this.logger.error('Generation pipeline crashed', {
        generationId: generation._id,
        error: error?.message,
      });
    });

    return {
      generationId: generation._id.toString(),
      status: generation.status,
    };
  }

  async findById(id: string, userId: string) {
    const generation = await this.generationModel.findById(id).exec();
    if (!generation) {
      throw new NotFoundException(`Generation with ID ${id} not found`);
    }
    if (generation.userId !== userId) {
      throw new ForbiddenException('You do not have access to this generation');
    }

    return {
      generationId: generation._id.toString(),
      status: generation.status,
      outputVideoUrl: generation.outputVideoUrl,
      errorMessage: generation.errorMessage,
    };
  }

  private async runPipeline(generationId: string, userId: string) {
    const generation = await this.generationModel.findById(generationId).exec();
    if (!generation) return;

    try {
      await this.generationModel
        .findByIdAndUpdate(generationId, { status: 'generating_shots' })
        .exec();

      // Resolve preset template by stable templateId
      const { templates } = await this.templatesService.findAll(
        { type: 'video' } as any,
        1,
        200,
      );
      const template = templates.find((t: any) => t.templateId === generation.templateId);

      if (!template) {
        throw new BadRequestException(
          `Template ${generation.templateId} not found or inactive`,
        );
      }

      // MVP: use the template's sourceS3Url as the "generated" video input
      // In the real pipeline, this is where shot-level Sora calls + stitching happens.
      const sourceUrl = template.sourceS3Url;
      if (!sourceUrl) {
        throw new BadRequestException('Template is missing sourceS3Url');
      }

      await this.generationModel
        .findByIdAndUpdate(generationId, { status: 'assembling' })
        .exec();

      // Download source and re-upload to S3 as generated output
      const sourceResponse = await axios.get<ArrayBuffer>(sourceUrl, {
        responseType: 'arraybuffer',
      });

      const buffer = Buffer.from(sourceResponse.data);
      const upload = await this.storageService.uploadFile(
        buffer,
        `generation-${generationId}.mp4`,
        'video/mp4',
        `generations/${userId}`,
      );

      await this.generationModel
        .findByIdAndUpdate(generationId, {
          status: 'adding_overlays',
          outputVideoUrl: upload.url,
          outputS3Key: upload.key,
        })
        .exec();

      // Overlays would be applied here (post-gen). For MVP we mark completed.
      await this.generationModel
        .findByIdAndUpdate(generationId, {
          status: 'completed',
        })
        .exec();

      const cost = COST_BY_MODE[generation.mode];
      await this.creditsService.deductCredits(
        userId,
        cost,
        `Video generation ${generationId}`,
      );
    } catch (error: any) {
      await this.generationModel
        .findByIdAndUpdate(generationId, {
          status: 'failed',
          errorMessage: error?.message || 'Generation failed',
        })
        .exec();

      throw error;
    }
  }
}
