import { SetMetadata } from '@nestjs/common';
import { SUBSCRIPTION_REQUIRED_KEY } from '../guards/subscription.guard';

export const SubscriptionRequired = () =>
  SetMetadata(SUBSCRIPTION_REQUIRED_KEY, true);
