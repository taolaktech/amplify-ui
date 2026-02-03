import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AdsService, CompetitorAdFilter } from './ads.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Ads')
@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  // Saved Ads Endpoints
  @Get('saved')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user saved ads' })
  @ApiQuery({ name: 'type', required: false, enum: ['template', 'competitor', 'trending'] })
  async getSavedAds(
    @CurrentUser('uid') userId: string,
    @Query('type') adType?: 'template' | 'competitor' | 'trending',
  ) {
    return this.adsService.getSavedAds(userId, adType);
  }

  @Get('saved/ids')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get IDs of user saved ads' })
  async getSavedAdIds(@CurrentUser('uid') userId: string) {
    const savedAdIds = await this.adsService.getSavedAdIds(userId);
    return { savedAdIds };
  }

  @Post('saved')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Save an ad' })
  async saveAd(
    @CurrentUser('uid') userId: string,
    @Body()
    body: {
      adId: string;
      adType: 'template' | 'competitor' | 'trending';
      adData?: Record<string, any>;
    },
  ) {
    return this.adsService.saveAd(userId, body.adId, body.adType, body.adData);
  }

  @Delete('saved/:adId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unsave an ad' })
  async unsaveAd(
    @CurrentUser('uid') userId: string,
    @Param('adId') adId: string,
  ) {
    await this.adsService.unsaveAd(userId, adId);
    return { success: true };
  }

  @Get('saved/:adId/check')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if ad is saved' })
  async isAdSaved(
    @CurrentUser('uid') userId: string,
    @Param('adId') adId: string,
  ) {
    const isSaved = await this.adsService.isAdSaved(userId, adId);
    return { isSaved };
  }

  // Competitor Ads Endpoints
  @Get('competitor')
  @ApiOperation({ summary: 'Get competitor ads with filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['newest', 'oldest', 'score'] })
  @ApiQuery({ name: 'platform', required: false, enum: ['meta', 'tiktok'] })
  @ApiQuery({ name: 'previewType', required: false, enum: ['video', 'image'] })
  @ApiQuery({ name: 'niche', required: false })
  @ApiQuery({ name: 'subNiche', required: false })
  @ApiQuery({ name: 'brand', required: false })
  @ApiQuery({ name: 'minScore', required: false, type: Number })
  @ApiQuery({ name: 'maxScore', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false })
  async getCompetitorAds(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('sortBy') sortBy: 'newest' | 'oldest' | 'score' = 'newest',
    @Query('platform') platform?: 'meta' | 'tiktok',
    @Query('previewType') previewType?: 'video' | 'image',
    @Query('niche') niche?: string,
    @Query('subNiche') subNiche?: string,
    @Query('brand') brand?: string,
    @Query('minScore') minScore?: number,
    @Query('maxScore') maxScore?: number,
    @Query('search') search?: string,
  ) {
    const filters: CompetitorAdFilter = {
      platform,
      previewType,
      niche,
      subNiche,
      brand,
      minScore,
      maxScore,
      search,
    };

    return this.adsService.getCompetitorAds(filters, page, limit, sortBy);
  }

  @Get('competitor/niches')
  @ApiOperation({ summary: 'Get available niches' })
  async getAvailableNiches() {
    const niches = await this.adsService.getAvailableNiches();
    return { niches };
  }

  @Get('competitor/brands')
  @ApiOperation({ summary: 'Get available brands' })
  async getAvailableBrands() {
    const brands = await this.adsService.getAvailableBrands();
    return { brands };
  }

  @Get('competitor/:id')
  @ApiOperation({ summary: 'Get competitor ad by ID' })
  async getCompetitorAdById(@Param('id') id: string) {
    return this.adsService.getCompetitorAdById(id);
  }

  @Post('competitor/:id/hooks')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate hooks for a competitor ad using AI' })
  async generateHooks(@Param('id') id: string) {
    const hooks = await this.adsService.generateHooksForAd(id);
    return { hooks };
  }
}
