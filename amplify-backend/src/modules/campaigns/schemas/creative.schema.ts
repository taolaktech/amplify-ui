import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CreativeDocument = Creative & Document;

export type CreativeType = 'image' | 'video';
export type CreativeStatus = 'pending' | 'generating' | 'completed' | 'failed';

@Schema({ timestamps: true, collection: 'creatives' })
export class Creative {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Campaign', index: true })
  campaignId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Template' })
  templateId: Types.ObjectId;

  @Prop({ required: true, enum: ['image', 'video'] })
  type: CreativeType;

  @Prop()
  outputS3Url?: string;

  @Prop()
  outputS3Key?: string;

  @Prop({ required: true, min: 0 })
  creditsUsed: number;

  @Prop({ default: 'pending', enum: ['pending', 'generating', 'completed', 'failed'] })
  status: CreativeStatus;

  @Prop()
  errorMessage?: string;

  @Prop({ type: Object })
  productData?: {
    productId: string;
    productImage: string;
    productName: string;
    description?: string;
    price?: string;
    cta?: string;
  };

  @Prop({ type: Object })
  generationMetadata?: Record<string, any>;
}

export const CreativeSchema = SchemaFactory.createForClass(Creative);

// Indexes
CreativeSchema.index({ campaignId: 1, status: 1 });
CreativeSchema.index({ templateId: 1 });
