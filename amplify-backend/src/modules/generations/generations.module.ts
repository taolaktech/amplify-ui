import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GenerationsController } from './generations.controller';
import { GenerationsService } from './generations.service';
import { Generation, GenerationSchema } from './schemas/generation.schema';
import { TemplatesModule } from '../templates/templates.module';
import { StorageModule } from '../storage/storage.module';
import { CreditsModule } from '../credits/credits.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Generation.name, schema: GenerationSchema },
    ]),
    TemplatesModule,
    StorageModule,
    CreditsModule,
  ],
  controllers: [GenerationsController],
  providers: [GenerationsService],
  exports: [GenerationsService],
})
export class GenerationsModule {}
