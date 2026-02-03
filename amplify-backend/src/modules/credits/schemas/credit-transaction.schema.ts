import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CreditTransactionDocument = CreditTransaction & Document;

export type TransactionType = 'credit' | 'debit';

@Schema({ timestamps: true, collection: 'credit_transactions' })
export class CreditTransaction {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true, enum: ['credit', 'debit'] })
  type: TransactionType;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  balanceAfter: number;

  @Prop()
  description?: string;

  @Prop()
  campaignId?: string;

  @Prop()
  creativeId?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const CreditTransactionSchema = SchemaFactory.createForClass(CreditTransaction);

// Indexes
CreditTransactionSchema.index({ userId: 1, createdAt: -1 });
CreditTransactionSchema.index({ userId: 1, type: 1 });
