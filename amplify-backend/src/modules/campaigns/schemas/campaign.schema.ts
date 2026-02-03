import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CampaignDocument = Campaign & Document;

export type CampaignStatus = 'draft' | 'generating' | 'generated' | 'published' | 'failed';

export interface ProductData {
  productId: string;
  productImage: string;
  productName: string;
  description?: string;
  price?: string;
  cta?: string;
}

@Schema({ timestamps: true, collection: 'campaigns' })
export class Campaign {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop()
  name?: string;

  @Prop({ type: [Object], default: [] })
  products: ProductData[];

  @Prop({ type: [Types.ObjectId], ref: 'Template', default: [] })
  templates: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Creative', default: [] })
  creatives: Types.ObjectId[];

  @Prop({ default: 0 })
  totalCreditsUsed: number;

  @Prop({ default: 'draft', enum: ['draft', 'generating', 'generated', 'published', 'failed'] })
  status: CampaignStatus;

  @Prop()
  errorMessage?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);

// Indexes
CampaignSchema.index({ userId: 1, status: 1 });
CampaignSchema.index({ userId: 1, createdAt: -1 });
