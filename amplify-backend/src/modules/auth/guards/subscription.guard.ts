import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';

export const SUBSCRIPTION_REQUIRED_KEY = 'subscriptionRequired';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiresSubscription = this.reflector.getAllAndOverride<boolean>(
      SUBSCRIPTION_REQUIRED_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If subscription is not required, allow access
    if (!requiresSubscription) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.user?.token;

    if (!token) {
      throw new ForbiddenException('Authentication required');
    }

    const subscriptionInfo = await this.authService.getSubscriptionInfo(token);

    if (!subscriptionInfo.hasActiveSubscription) {
      throw new ForbiddenException(
        'Active subscription required to access this resource',
      );
    }

    // Attach subscription info to request
    request.subscription = subscriptionInfo;
    return true;
  }
}
