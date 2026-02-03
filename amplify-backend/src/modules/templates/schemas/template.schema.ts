import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TemplateDocument = Template & Document;

export type TemplateType = 'image' | 'video';
export type TemplateStatus = 'pending' | 'parsing' | 'active' | 'failed';

export interface TemplateLayer {
  id: string;
  type: 'image' | 'text' | 'shape' | 'video';
  position: { x: number; y: number };
  size: { width: number; height: number };
  content?: string;
  isReplaceable: boolean;
  replaceableField?: 'productImage' | 'productName' | 'description' | 'price' | 'cta';
  style?: Record<string, any>;
}

export interface ParsedTemplateJson {
  mediaType: 'image' | 'video';
  dimensions: { width: number; height: number };
  layers: TemplateLayer[];
  staticCopy: string[];
  replaceableFields: {
    productImage: boolean;
    productName: boolean;
    description: boolean;
    price: boolean;
    cta: boolean;
  };
  metadata: Record<string, any>;
}

@Schema({ timestamps: true, collection: 'templates' })
export class Template {
  @Prop({ unique: true, sparse: true })
  templateId?: string;

  @Prop({ required: true, enum: ['image', 'video'] })
  type: TemplateType;

  @Prop({ required: true })
  sourceS3Url: string;

  @Prop({ type: Object })
  parsedJson?: ParsedTemplateJson;

  @Prop({ default: 'pending', enum: ['pending', 'parsing', 'active', 'failed'] })
  status: TemplateStatus;

  @Prop()
  parseError?: string;

  @Prop()
  title?: string;

  @Prop()
  description?: string;

  @Prop()
  thumbnailUrl?: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop()
  category?: string;

  @Prop({ default: 0 })
  usageCount: number;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const TemplateSchema = SchemaFactory.createForClass(Template);

// Indexes for common queries
TemplateSchema.index({ status: 1, type: 1 });
TemplateSchema.index({ category: 1 });
TemplateSchema.index({ tags: 1 });
