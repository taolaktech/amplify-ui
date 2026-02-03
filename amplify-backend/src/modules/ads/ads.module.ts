import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdsController } from './ads.controller';
import { AdsService } from './ads.service';
import { SavedAd, SavedAdSchema } from './schemas/saved-ad.schema';
import { CompetitorAd, CompetitorAdSchema } from './schemas/competitor-ad.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SavedAd.name, schema: SavedAdSchema },
      { name: CompetitorAd.name, schema: CompetitorAdSchema },
    ]),
  ],
  controllers: [AdsController],
  providers: [AdsService],
  exports: [AdsService],
})
export class AdsModule {}
