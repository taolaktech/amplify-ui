import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GenerationDocument = Generation & Document;

export type GenerationStatus =
  | 'queued'
  | 'generating_shots'
  | 'assembling'
  | 'adding_overlays'
  | 'completed'
  | 'failed';

@Schema({ timestamps: true, collection: 'generations' })
export class Generation {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true })
  productKitId: string;

  @Prop({ required: true, index: true })
  templateId: string;

  @Prop({ required: true, enum: ['standard', 'pro'] })
  mode: 'standard' | 'pro';

  @Prop({ required: true, enum: ['queued', 'generating_shots', 'assembling', 'adding_overlays', 'completed', 'failed'], default: 'queued' })
  status: GenerationStatus;

  @Prop()
  outputVideoUrl?: string;

  @Prop()
  outputS3Key?: string;

  @Prop()
  errorMessage?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const GenerationSchema = SchemaFactory.createForClass(Generation);

GenerationSchema.index({ userId: 1, createdAt: -1 });
