import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { SavedAd, SavedAdDocument } from './schemas/saved-ad.schema';
import { CompetitorAd, CompetitorAdDocument } from './schemas/competitor-ad.schema';
import { AuditService } from '../audit/audit.service';
import { GeminiService } from '../ai/gemini.service';

export interface CompetitorAdFilter {
  platform?: 'meta' | 'tiktok';
  niche?: string;
  subNiche?: string;
  previewType?: 'video' | 'image';
  status?: 'active' | 'inactive';
  minScore?: number;
  maxScore?: number;
  brand?: string;
  search?: string;
}

@Injectable()
export class AdsService {
  constructor(
    @InjectModel(SavedAd.name)
    private savedAdModel: Model<SavedAdDocument>,
    @InjectModel(CompetitorAd.name)
    private competitorAdModel: Model<CompetitorAdDocument>,
    private auditService: AuditService,
    private geminiService: GeminiService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  // Saved Ads
  async saveAd(
    userId: string,
    adId: string,
    adType: 'template' | 'competitor' | 'trending',
    adData?: Record<string, any>,
  ): Promise<SavedAd> {
    try {
      const savedAd = new this.savedAdModel({
        userId,
        adId,
        adType,
        adData,
      });

      const result = await savedAd.save();

      await this.auditService.log({
        userId,
        action: 'SAVE_AD',
        resource: 'saved_ad',
        resourceId: adId,
        details: { adType },
      });

      this.logger.info('Ad saved', { userId, adId, adType });
      return result;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException('Ad already saved');
      }
      throw error;
    }
  }

  async unsaveAd(userId: string, adId: string): Promise<void> {
    const result = await this.savedAdModel
      .findOneAndDelete({ userId, adId })
      .exec();

    if (!result) {
      throw new NotFoundException('Saved ad not found');
    }

    await this.auditService.log({
      userId,
      action: 'UNSAVE_AD',
      resource: 'saved_ad',
      resourceId: adId,
    });

    this.logger.info('Ad unsaved', { userId, adId });
  }

  async getSavedAds(
    userId: string,
    adType?: 'template' | 'competitor' | 'trending',
  ): Promise<SavedAd[]> {
    const query: FilterQuery<SavedAdDocument> = { userId };
    if (adType) {
      query.adType = adType;
    }

    return this.savedAdModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async getSavedAdIds(userId: string): Promise<string[]> {
    const savedAds = await this.savedAdModel
      .find({ userId })
      .select('adId')
      .exec();

    return savedAds.map((ad) => ad.adId);
  }

  async isAdSaved(userId: string, adId: string): Promise<boolean> {
    const count = await this.savedAdModel.countDocuments({ userId, adId });
    return count > 0;
  }

  // Competitor Ads
  async getCompetitorAds(
    filters: CompetitorAdFilter,
    page = 1,
    limit = 20,
    sortBy: 'newest' | 'oldest' | 'score' = 'newest',
  ): Promise<{ ads: CompetitorAd[]; total: number; pages: number }> {
    const query: FilterQuery<CompetitorAdDocument> = { status: 'active' };

    if (filters.platform) {
      query.platform = filters.platform;
    }
    if (filters.niche) {
      query.niche = filters.niche;
    }
    if (filters.subNiche) {
      query.subNiche = filters.subNiche;
    }
    if (filters.previewType) {
      query.previewType = filters.previewType;
    }
    if (filters.brand) {
      query.brand = { $regex: filters.brand, $options: 'i' };
    }
    if (filters.minScore !== undefined || filters.maxScore !== undefined) {
      query.adScore = {};
      if (filters.minScore !== undefined) query.adScore.$gte = filters.minScore;
      if (filters.maxScore !== undefined) query.adScore.$lte = filters.maxScore;
    }
    if (filters.search) {
      query.$or = [
        { brand: { $regex: filters.search, $options: 'i' } },
        { headline: { $regex: filters.search, $options: 'i' } },
        { productName: { $regex: filters.search, $options: 'i' } },
      ];
    }

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sortBy === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sortBy === 'score') {
      sortOption = { adScore: -1 };
    }

    const [ads, total] = await Promise.all([
      this.competitorAdModel
        .find(query)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.competitorAdModel.countDocuments(query),
    ]);

    return {
      ads,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async getCompetitorAdById(id: string): Promise<CompetitorAd> {
    const ad = await this.competitorAdModel.findById(id).exec();
    if (!ad) {
      throw new NotFoundException(`Competitor ad with ID ${id} not found`);
    }
    return ad;
  }

  async generateHooksForAd(adId: string): Promise<string[]> {
    const ad = await this.getCompetitorAdById(adId);

    const adCopy = await this.geminiService.generateAdCopy(
      {
        productImage: '',
        productName: ad.productName || 'Product',
        description: ad.niche,
      },
      ad.previewType === 'video' ? 'casual' : 'professional',
    );

    const hooks = [adCopy.headline, adCopy.description, adCopy.cta];

    // Update the ad with generated hooks
    await this.competitorAdModel
      .findByIdAndUpdate(adId, { hooks })
      .exec();

    return hooks;
  }

  async getAvailableNiches(): Promise<string[]> {
    const niches = await this.competitorAdModel.distinct('niche', {
      status: 'active',
    });
    return niches.sort();
  }

  async getAvailableBrands(): Promise<string[]> {
    const brands = await this.competitorAdModel.distinct('brand', {
      status: 'active',
    });
    return brands.sort();
  }
}
