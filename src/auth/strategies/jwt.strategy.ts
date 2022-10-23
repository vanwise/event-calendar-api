import { ConfigService } from '@nestjs/config';
import { ConfigServiceType } from '../../config/config.utils';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService, TokenPayload } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    @Inject(ConfigService)
    private configService: ConfigServiceType,
  ) {
    super({
      secretOrKey: configService.get('ACCESS_JWT_SECRET_KEY'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  async validate({ id, login, iat }: TokenPayload) {
    await this.authService.validateUserByLoginFromJwt(login, iat);
    return { id, login };
  }
}
