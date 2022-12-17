import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenInfo, VerifiedToken } from './helpers/types';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'maria',
    });
  }

  async validate(payload: TokenInfo): Promise<VerifiedToken> {
    const { userId, sessionToken } = payload;
    const user = await this.userService.findById(userId);
    if (!user || sessionToken !== user.sessionToken) {
      throw new UnauthorizedException();
    }
    return { userId, role: user.role };
  }
}
