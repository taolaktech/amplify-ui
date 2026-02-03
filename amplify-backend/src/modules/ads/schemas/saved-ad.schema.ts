import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SavedAdDocument = SavedAd & Document;

@Schema({ timestamps: true, collection: 'saved_ads' })
export class SavedAd {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true })
  adId: string;

  @Prop({ required: true })
  adType: 'template' | 'competitor' | 'trending';

  @Prop({ type: Object })
  adData?: Record<string, any>;

  @Prop()
  notes?: string;
}

export const SavedAdSchema = SchemaFactory.createForClass(SavedAd);

// Compound index for user's saved ads
SavedAdSchema.index({ userId: 1, adId: 1 }, { unique: true });
SavedAdSchema.index({ userId: 1, adType: 1 });
