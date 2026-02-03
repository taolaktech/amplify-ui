import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import * as admin from 'firebase-admin';
import axios from 'axios';

export interface DecodedToken {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
}

export interface SubscriptionInfo {
  hasActiveSubscription: boolean;
  subscriptionType?: string;
  subscriptionEndDate?: string;
}

@Injectable()
export class AuthService implements OnModuleInit {
  private firebaseApp: admin.app.App | null = null;

  constructor(
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  onModuleInit() {
    const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
    const privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY');
    const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');

    if (projectId && privateKey && clientEmail) {
      try {
        this.firebaseApp = admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            privateKey: privateKey.replace(/\\n/g, '\n'),
            clientEmail,
          }),
        });
        this.logger.info('Firebase Admin initialized successfully');
      } catch (error) {
        this.logger.error('Failed to initialize Firebase Admin', { error });
      }
    } else {
      this.logger.warn('Firebase credentials not configured');
    }
  }

  async verifyToken(token: string): Promise<DecodedToken | null> {
    if (!this.firebaseApp) {
      this.logger.error('Firebase not initialized');
      return null;
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      return {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
        picture: decodedToken.picture,
      };
    } catch (error) {
      this.logger.error('Token verification failed', { error });
      return null;
    }
  }

  async getSubscriptionInfo(token: string): Promise<SubscriptionInfo> {
    const walletApiUrl = this.configService.get<string>('AMPLIFY_WALLET_API_URL');

    if (!walletApiUrl) {
      this.logger.warn('Wallet API URL not configured');
      return { hasActiveSubscription: false };
    }

    try {
      const response = await axios.get(
        `${walletApiUrl}/stripe/subscriptions/current?sync=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = response.data?.data;
      return {
        hasActiveSubscription: !!data?.activeStripePriceId,
        subscriptionType: data?.subscriptionType,
        subscriptionEndDate: data?.currentPeriodEnd,
      };
    } catch (error) {
      this.logger.error('Failed to fetch subscription info', { error });
      return { hasActiveSubscription: false };
    }
  }
}
