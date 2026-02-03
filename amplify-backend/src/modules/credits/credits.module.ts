import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreditsController } from './credits.controller';
import { CreditsService } from './credits.service';
import { CreditTransaction, CreditTransactionSchema } from './schemas/credit-transaction.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CreditTransaction.name, schema: CreditTransactionSchema },
    ]),
  ],
  controllers: [CreditsController],
  providers: [CreditsService],
  exports: [CreditsService],
})
export class CreditsModule {}
