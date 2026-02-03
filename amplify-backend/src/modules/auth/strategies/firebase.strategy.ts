import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'firebase-public-key', // Firebase tokens are verified differently
      passReqToCallback: true,
    });
  }

  async validate(req: any): Promise<any> {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const user = await this.authService.verifyToken(token);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    // Attach the raw token for downstream use (e.g., wallet API calls)
    return { ...user, token };
  }
}
