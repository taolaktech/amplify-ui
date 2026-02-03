import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { TemplateType, TemplateStatus } from '../schemas/template.schema';

export class CreateTemplateDto {
  @ApiPropertyOptional({ description: 'Stable template key used by UI (e.g. ugc_simple_v1)' })
  @IsOptional()
  @IsString()
  templateId?: string;

  @ApiProperty({ enum: ['image', 'video'], description: 'Template type' })
  @IsEnum(['image', 'video'])
  type: TemplateType;

  @ApiProperty({ description: 'S3 URL of the source template' })
  @IsString()
  sourceS3Url: string;

  @ApiPropertyOptional({ description: 'Template title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Template description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Category (e.g., Beauty, Fashion)' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Tags for search', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class UpdateTemplateDto extends PartialType(CreateTemplateDto) {
  @ApiPropertyOptional({ enum: ['pending', 'parsing', 'active', 'failed'] })
  @IsOptional()
  @IsEnum(['pending', 'parsing', 'active', 'failed'])
  status?: TemplateStatus;
}

export class ParseTemplateDto {
  @ApiProperty({ description: 'Template ID to parse' })
  @IsString()
  templateId: string;
}

export class TemplateFilterDto {
  @ApiPropertyOptional({ enum: ['image', 'video'] })
  @IsOptional()
  @IsEnum(['image', 'video'])
  type?: TemplateType;

  @ApiPropertyOptional({ enum: ['pending', 'parsing', 'active', 'failed'] })
  @IsOptional()
  @IsEnum(['pending', 'parsing', 'active', 'failed'])
  status?: TemplateStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Search query' })
  @IsOptional()
  @IsString()
  search?: string;
}
