import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  CreditTransaction,
  CreditTransactionDocument,
} from './schemas/credit-transaction.schema';
import { AuditService } from '../audit/audit.service';

export interface CreditBalance {
  balance: number;
  lastUpdated: Date;
}

export interface CreditHistory {
  transactions: CreditTransaction[];
  total: number;
  pages: number;
}

@Injectable()
export class CreditsService {
  private walletApiUrl: string;

  constructor(
    @InjectModel(CreditTransaction.name)
    private creditTransactionModel: Model<CreditTransactionDocument>,
    private configService: ConfigService,
    private auditService: AuditService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.walletApiUrl = this.configService.get<string>(
      'AMPLIFY_WALLET_API_URL',
      '',
    );
  }

  async getBalance(userId: string): Promise<CreditBalance> {
    try {
      // Try to get balance from wallet API
      if (this.walletApiUrl) {
        const response = await axios.get(
          `${this.walletApiUrl}/credits/${userId}`,
        );
        return {
          balance: response.data.balance || 0,
          lastUpdated: new Date(),
        };
      }

      // Fallback: Calculate from local transactions
      const result = await this.creditTransactionModel.aggregate([
        { $match: { userId } },
        { $sort: { createdAt: -1 } },
        { $limit: 1 },
      ]);

      return {
        balance: result.length > 0 ? result[0].balanceAfter : 0,
        lastUpdated: result.length > 0 ? result[0].createdAt : new Date(),
      };
    } catch (error: any) {
      this.logger.error('Failed to get credit balance', {
        userId,
        error: error.message,
      });

      // Return 0 balance on error
      return { balance: 0, lastUpdated: new Date() };
    }
  }

  async hasEnoughCredits(userId: string, required: number): Promise<boolean> {
    const { balance } = await this.getBalance(userId);
    return balance >= required;
  }

  async deductCredits(
    userId: string,
    amount: number,
    description?: string,
    campaignId?: string,
    creativeId?: string,
  ): Promise<CreditTransaction> {
    const { balance } = await this.getBalance(userId);

    if (balance < amount) {
      throw new BadRequestException(
        `Insufficient credits. Available: ${balance}, Required: ${amount}`,
      );
    }

    const newBalance = balance - amount;

    // Record transaction locally
    const transaction = new this.creditTransactionModel({
      userId,
      type: 'debit',
      amount,
      balanceAfter: newBalance,
      description,
      campaignId,
      creativeId,
    });

    const saved = await transaction.save();

    // Sync with wallet API if available
    if (this.walletApiUrl) {
      try {
        await axios.post(`${this.walletApiUrl}/credits/${userId}/deduct`, {
          amount,
          description,
          transactionId: saved._id.toString(),
        });
      } catch (error: any) {
        this.logger.warn('Failed to sync credit deduction with wallet API', {
          userId,
          amount,
          error: error.message,
        });
      }
    }

    await this.auditService.log({
      userId,
      action: 'DEDUCT_CREDITS',
      resource: 'credits',
      resourceId: saved._id.toString(),
      details: { amount, newBalance, description },
    });

    this.logger.info('Credits deducted', {
      userId,
      amount,
      newBalance,
    });

    return saved;
  }

  async addCredits(
    userId: string,
    amount: number,
    description?: string,
  ): Promise<CreditTransaction> {
    const { balance } = await this.getBalance(userId);
    const newBalance = balance + amount;

    const transaction = new this.creditTransactionModel({
      userId,
      type: 'credit',
      amount,
      balanceAfter: newBalance,
      description,
    });

    const saved = await transaction.save();

    // Sync with wallet API if available
    if (this.walletApiUrl) {
      try {
        await axios.post(`${this.walletApiUrl}/credits/${userId}/add`, {
          amount,
          description,
          transactionId: saved._id.toString(),
        });
      } catch (error: any) {
        this.logger.warn('Failed to sync credit addition with wallet API', {
          userId,
          amount,
          error: error.message,
        });
      }
    }

    await this.auditService.log({
      userId,
      action: 'ADD_CREDITS',
      resource: 'credits',
      resourceId: saved._id.toString(),
      details: { amount, newBalance, description },
    });

    this.logger.info('Credits added', {
      userId,
      amount,
      newBalance,
    });

    return saved;
  }

  async getHistory(
    userId: string,
    page = 1,
    limit = 20,
    type?: 'credit' | 'debit',
  ): Promise<CreditHistory> {
    const query: any = { userId };
    if (type) {
      query.type = type;
    }

    const [transactions, total] = await Promise.all([
      this.creditTransactionModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.creditTransactionModel.countDocuments(query),
    ]);

    return {
      transactions,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async getUsageByPeriod(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{ totalUsed: number; breakdown: { date: string; amount: number }[] }> {
    const transactions = await this.creditTransactionModel
      .find({
        userId,
        type: 'debit',
        createdAt: { $gte: startDate, $lte: endDate },
      })
      .sort({ createdAt: 1 })
      .exec();

    const breakdown: { date: string; amount: number }[] = [];
    let totalUsed = 0;

    const dailyUsage: Record<string, number> = {};

    for (const tx of transactions) {
      const dateKey = (tx as any).createdAt.toISOString().split('T')[0];
      dailyUsage[dateKey] = (dailyUsage[dateKey] || 0) + tx.amount;
      totalUsed += tx.amount;
    }

    for (const [date, amount] of Object.entries(dailyUsage)) {
      breakdown.push({ date, amount });
    }

    return { totalUsed, breakdown };
  }

  async getCampaignCredits(
    userId: string,
    campaignId: string,
  ): Promise<{ total: number; transactions: CreditTransaction[] }> {
    const transactions = await this.creditTransactionModel
      .find({ userId, campaignId })
      .sort({ createdAt: -1 })
      .exec();

    const total = transactions.reduce((sum, tx) => {
      return tx.type === 'debit' ? sum + tx.amount : sum;
    }, 0);

    return { total, transactions };
  }
}
