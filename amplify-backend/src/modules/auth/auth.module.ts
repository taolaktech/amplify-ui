import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { FirebaseStrategy } from './strategies/firebase.strategy';
import { AuthGuard } from './guards/auth.guard';
import { SubscriptionGuard } from './guards/subscription.guard';

@Module({
  imports: [PassportModule, ConfigModule],
  providers: [AuthService, FirebaseStrategy, AuthGuard, SubscriptionGuard],
  exports: [AuthService, AuthGuard, SubscriptionGuard],
})
export class AuthModule {}
