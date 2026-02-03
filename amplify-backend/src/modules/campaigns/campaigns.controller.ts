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
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto, CampaignFilterDto } from './dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Campaigns')
@Controller('campaigns')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new campaign' })
  async create(
    @Body() createCampaignDto: CreateCampaignDto,
    @CurrentUser('uid') userId: string,
  ) {
    return this.campaignsService.create(createCampaignDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all campaigns for current user' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false })
  async findAll(
    @CurrentUser('uid') userId: string,
    @Query() filters: CampaignFilterDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.campaignsService.findAllByUser(
      userId,
      filters.status,
      page,
      limit,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get campaign by ID' })
  async findById(
    @Param('id') id: string,
    @CurrentUser('uid') userId: string,
  ) {
    return this.campaignsService.findById(id, userId);
  }

  @Get(':id/creatives')
  @ApiOperation({ summary: 'Get creatives for a campaign' })
  async getCreatives(
    @Param('id') id: string,
    @CurrentUser('uid') userId: string,
  ) {
    return this.campaignsService.getCreatives(id, userId);
  }

  @Post('generate')
  @ApiOperation({ summary: 'Generate creatives for a campaign' })
  async generate(
    @Body('campaignId') campaignId: string,
    @CurrentUser('uid') userId: string,
  ) {
    return this.campaignsService.generate(campaignId, userId);
  }

  @Post('estimate-credits')
  @ApiOperation({ summary: 'Estimate credits required for a campaign' })
  async estimateCredits(
    @Body('templateIds') templateIds: string[],
    @Body('productCount') productCount: number,
  ) {
    return this.campaignsService.estimateCredits(templateIds, productCount);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a campaign' })
  async delete(
    @Param('id') id: string,
    @CurrentUser('uid') userId: string,
  ) {
    await this.campaignsService.delete(id, userId);
    return { success: true };
  }
}
