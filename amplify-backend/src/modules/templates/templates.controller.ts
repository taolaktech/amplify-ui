import {
  Controller,
  Get,
  Post,
  Put,
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
import { TemplatesService } from './templates.service';
import { CreateTemplateDto, UpdateTemplateDto, TemplateFilterDto } from './dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Templates')
@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all templates with filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query() filters: TemplateFilterDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.templatesService.findAll(filters, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get template by ID' })
  async findById(@Param('id') id: string) {
    return this.templatesService.findById(id);
  }

  @Get(':id/parsed')
  @ApiOperation({ summary: 'Get parsed JSON for a template' })
  async getParsedJson(@Param('id') id: string) {
    return this.templatesService.getParsedJson(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new template' })
  async create(
    @Body() createTemplateDto: CreateTemplateDto,
    @CurrentUser('uid') userId: string,
  ) {
    return this.templatesService.create(createTemplateDto, userId);
  }

  @Post('parse')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Parse template using Gemini (transform to JSON)' })
  async parseTemplate(
    @Body('templateId') templateId: string,
    @CurrentUser('uid') userId: string,
  ) {
    return this.templatesService.parseTemplate(templateId, userId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a template' })
  async update(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
    @CurrentUser('uid') userId: string,
  ) {
    return this.templatesService.update(id, updateTemplateDto, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a template' })
  async delete(@Param('id') id: string, @CurrentUser('uid') userId: string) {
    return this.templatesService.delete(id, userId);
  }
}
