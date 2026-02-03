import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGenerationDto {
  @ApiProperty()
  @IsString()
  productKitId: string;

  @ApiProperty({ description: 'Stable template key, e.g. ugc_simple_v1' })
  @IsString()
  templateId: string;

  @ApiProperty({ enum: ['standard', 'pro'] })
  @IsEnum(['standard', 'pro'])
  mode: 'standard' | 'pro';
}
