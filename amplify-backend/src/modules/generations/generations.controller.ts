import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GenerationsService } from './generations.service';
import { CreateGenerationDto } from './dto/create-generation.dto';

@ApiTags('Generations')
@Controller('generations')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class GenerationsController {
  constructor(private readonly generationsService: GenerationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a video generation job' })
  async create(
    @Body() dto: CreateGenerationDto,
    @CurrentUser('uid') userId: string,
  ) {
    return this.generationsService.create(dto, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get generation job by ID' })
  async findById(@Param('id') id: string, @CurrentUser('uid') userId: string) {
    return this.generationsService.findById(id, userId);
  }
}
