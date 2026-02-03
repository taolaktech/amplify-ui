import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CompetitorAdDocument = CompetitorAd & Document;

@Schema({ timestamps: true, collection: 'competitor_ads' })
export class CompetitorAd {
  @Prop({ required: true })
  brand: string;

  @Prop({ default: false })
  isNew: boolean;

  @Prop()
  daysAgo?: number;

  @Prop({ required: true, enum: ['video', 'image'] })
  previewType: 'video' | 'image';

  @Prop({ required: true })
  previewUrl: string;

  @Prop({ required: true })
  headline: string;

  @Prop()
  domain?: string;

  @Prop({ required: true })
  productName: string;

  @Prop()
  cta?: string;

  @Prop({ required: true, enum: ['meta', 'tiktok'] })
  platform: 'meta' | 'tiktok';

  @Prop({ required: true })
  niche: string;

  @Prop()
  subNiche?: string;

  @Prop({ default: 'active', enum: ['active', 'inactive'] })
  status: 'active' | 'inactive';

  @Prop({ default: 0, min: 0, max: 100 })
  adScore: number;

  @Prop()
  hook?: string;

  @Prop({ type: [String], default: [] })
  hooks: string[];

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const CompetitorAdSchema = SchemaFactory.createForClass(CompetitorAd);

// Indexes
CompetitorAdSchema.index({ platform: 1, status: 1 });
CompetitorAdSchema.index({ niche: 1, subNiche: 1 });
CompetitorAdSchema.index({ brand: 1 });
CompetitorAdSchema.index({ adScore: -1 });
