import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {
  Template,
  TemplateDocument,
  ParsedTemplateJson,
} from './schemas/template.schema';
import { AuditService } from '../audit/audit.service';
import { GeminiService } from '../ai/gemini.service';
import { CreateTemplateDto, UpdateTemplateDto, TemplateFilterDto } from './dto';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel(Template.name)
    private templateModel: Model<TemplateDocument>,
    private auditService: AuditService,
    private geminiService: GeminiService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(
    createTemplateDto: CreateTemplateDto,
    userId: string,
  ): Promise<Template> {
    const template = new this.templateModel({
      ...createTemplateDto,
      status: 'pending',
    });
    const saved = await template.save();

    await this.auditService.log({
      userId,
      action: 'CREATE',
      resource: 'template',
      resourceId: saved._id.toString(),
      details: { sourceS3Url: saved.sourceS3Url, type: saved.type },
    });

    this.logger.info('Template created', {
      templateId: saved._id,
      type: saved.type,
    });

    return saved;
  }

  async findAll(
    filters: TemplateFilterDto,
    page = 1,
    limit = 20,
  ): Promise<{ templates: Template[]; total: number; pages: number }> {
    const query: FilterQuery<TemplateDocument> = {};

    if (filters.status) {
      query.status = filters.status;
    } else {
      query.status = 'active';
    }
    if (filters.type) {
      query.type = filters.type;
    }
    if (filters.category) {
      query.category = filters.category;
    }
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { tags: { $in: [new RegExp(filters.search, 'i')] } },
      ];
    }

    const anyFilters = filters as any;
    const explicitTemplateId = anyFilters?.templateId;
    const metadataTemplateId = anyFilters?.metadata?.templateId;
    if (explicitTemplateId) {
      (query as any).templateId = explicitTemplateId;
    } else if (metadataTemplateId) {
      (query as any).templateId = metadataTemplateId;
    }

    const [templates, total] = await Promise.all([
      this.templateModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.templateModel.countDocuments(query),
    ]);

    return {
      templates,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Template> {
    const template = await this.templateModel.findById(id).exec();
    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }
    return template;
  }

  async parseTemplate(templateId: string, userId: string): Promise<Template> {
    const template = await this.templateModel.findById(templateId).exec();
    if (!template) {
      throw new NotFoundException(`Template with ID ${templateId} not found`);
    }

    if (template.status === 'parsing') {
      throw new BadRequestException('Template is already being parsed');
    }

    // Set status to parsing
    await this.templateModel
      .findByIdAndUpdate(templateId, { status: 'parsing' })
      .exec();

    try {
      this.logger.info('Starting template parsing', { templateId });

      const parsedJson = await this.geminiService.parseTemplateToJson(
        template.sourceS3Url,
        template.type,
      );

      // Update template with parsed JSON
      const updated = await this.templateModel
        .findByIdAndUpdate(
          templateId,
          {
            parsedJson: { ...parsedJson, templateId },
            status: 'active',
            parseError: null,
          },
          { new: true },
        )
        .exec();

      await this.auditService.log({
        userId,
        action: 'PARSE',
        resource: 'template',
        resourceId: templateId,
        details: { success: true },
      });

      this.logger.info('Template parsed successfully', { templateId });
      return updated!;
    } catch (error: any) {
      // Update status to failed
      await this.templateModel
        .findByIdAndUpdate(templateId, {
          status: 'failed',
          parseError: error.message,
        })
        .exec();

      await this.auditService.log({
        userId,
        action: 'PARSE',
        resource: 'template',
        resourceId: templateId,
        details: { success: false, error: error.message },
      });

      this.logger.error('Template parsing failed', {
        templateId,
        error: error.message,
      });

      throw new BadRequestException(`Template parsing failed: ${error.message}`);
    }
  }

  async update(
    id: string,
    updateTemplateDto: UpdateTemplateDto,
    userId: string,
  ): Promise<Template> {
    const template = await this.templateModel
      .findByIdAndUpdate(id, updateTemplateDto, { new: true })
      .exec();

    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }

    await this.auditService.log({
      userId,
      action: 'UPDATE',
      resource: 'template',
      resourceId: id,
      details: updateTemplateDto,
    });

    return template;
  }

  async delete(id: string, userId: string): Promise<void> {
    const template = await this.templateModel.findById(id).exec();
    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }

    await this.templateModel.findByIdAndDelete(id).exec();

    await this.auditService.log({
      userId,
      action: 'DELETE',
      resource: 'template',
      resourceId: id,
      details: { sourceS3Url: template.sourceS3Url },
    });

    this.logger.info('Template deleted', { templateId: id });
  }

  async incrementUsage(id: string): Promise<void> {
    await this.templateModel
      .findByIdAndUpdate(id, { $inc: { usageCount: 1 } })
      .exec();
  }

  async getActiveTemplates(
    type?: 'image' | 'video',
    page = 1,
    limit = 20,
  ): Promise<{ templates: Template[]; total: number; pages: number }> {
    const query: FilterQuery<TemplateDocument> = { status: 'active' };
    if (type) {
      query.type = type;
    }

    const [templates, total] = await Promise.all([
      this.templateModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.templateModel.countDocuments(query),
    ]);

    return {
      templates,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async getParsedJson(id: string): Promise<ParsedTemplateJson> {
    const template = await this.findById(id);
    if (!template.parsedJson) {
      throw new BadRequestException('Template has not been parsed yet');
    }
    return template.parsedJson;
  }
}
