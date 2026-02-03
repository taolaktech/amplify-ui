import {
  Controller,
  Get,
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
import { CreditsService } from './credits.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Credits')
@Controller('credits')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}

  @Get()
  @ApiOperation({ summary: 'Get current credit balance' })
  async getBalance(@CurrentUser('uid') userId: string) {
    return this.creditsService.getBalance(userId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get credit transaction history' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, enum: ['credit', 'debit'] })
  async getHistory(
    @CurrentUser('uid') userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('type') type?: 'credit' | 'debit',
  ) {
    return this.creditsService.getHistory(userId, page, limit, type);
  }

  @Get('usage')
  @ApiOperation({ summary: 'Get credit usage for a period' })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  async getUsageByPeriod(
    @CurrentUser('uid') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.creditsService.getUsageByPeriod(
      userId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('campaign/:campaignId')
  @ApiOperation({ summary: 'Get credits used for a specific campaign' })
  async getCampaignCredits(
    @CurrentUser('uid') userId: string,
    @Query('campaignId') campaignId: string,
  ) {
    return this.creditsService.getCampaignCredits(userId, campaignId);
  }
}
