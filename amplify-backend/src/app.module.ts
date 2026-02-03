import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

import { AuthModule } from './modules/auth/auth.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { AdsModule } from './modules/ads/ads.module';
import { AiModule } from './modules/ai/ai.module';
import { StorageModule } from './modules/storage/storage.module';
import { HealthModule } from './modules/health/health.module';
import { AuditModule } from './modules/audit/audit.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { CreditsModule } from './modules/credits/credits.module';
import { GenerationsModule } from './modules/generations/generations.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Winston Logger
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logDir = configService.get<string>('LOG_DIR', 'logs');
        const logLevel = configService.get<string>('LOG_LEVEL', 'info');

        return {
          level: logLevel,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.json(),
          ),
          defaultMeta: { service: 'amplify-backend' },
          transports: [
            // Console transport
            new winston.transports.Console({
              format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
              ),
            }),
            // File transport for all logs
            new winston.transports.DailyRotateFile({
              filename: `${logDir}/application-%DATE%.log`,
              datePattern: 'YYYY-MM-DD',
              zippedArchive: true,
              maxSize: '20m',
              maxFiles: '14d',
            }),
            // File transport for errors only
            new winston.transports.DailyRotateFile({
              filename: `${logDir}/error-%DATE%.log`,
              datePattern: 'YYYY-MM-DD',
              zippedArchive: true,
              maxSize: '20m',
              maxFiles: '30d',
              level: 'error',
            }),
            // Audit trail transport
            new winston.transports.DailyRotateFile({
              filename: `${logDir}/audit-%DATE%.log`,
              datePattern: 'YYYY-MM-DD',
              zippedArchive: true,
              maxSize: '50m',
              maxFiles: '90d',
            }),
          ],
        };
      },
    }),

    // MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),

    // Feature modules
    AuthModule,
    TemplatesModule,
    AdsModule,
    AiModule,
    StorageModule,
    HealthModule,
    AuditModule,
    CampaignsModule,
    CreditsModule,
    GenerationsModule,
  ],
})
export class AppModule {}
