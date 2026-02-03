import {
  IsString,
  IsOptional,
  IsArray,
  IsObject,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ProductDataDto {
  @ApiProperty({ description: 'Product ID' })
  @IsString()
  productId: string;

  @ApiProperty({ description: 'Product image URL' })
  @IsString()
  productImage: string;

  @ApiProperty({ description: 'Product name' })
  @IsString()
  productName: string;

  @ApiPropertyOptional({ description: 'Product description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Product price' })
  @IsOptional()
  @IsString()
  price?: string;

  @ApiPropertyOptional({ description: 'Call to action text' })
  @IsOptional()
  @IsString()
  cta?: string;
}

export class CreateCampaignDto {
  @ApiPropertyOptional({ description: 'Campaign name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Products to use in the campaign', type: [ProductDataDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDataDto)
  products: ProductDataDto[];

  @ApiProperty({ description: 'Template IDs to use', type: [String] })
  @IsArray()
  @IsString({ each: true })
  templateIds: string[];

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class GenerateCampaignDto {
  @ApiProperty({ description: 'Campaign ID to generate creatives for' })
  @IsString()
  campaignId: string;
}

export class CampaignFilterDto {
  @ApiPropertyOptional({ enum: ['draft', 'generating', 'generated', 'published', 'failed'] })
  @IsOptional()
  @IsEnum(['draft', 'generating', 'generated', 'published', 'failed'])
  status?: string;
}
