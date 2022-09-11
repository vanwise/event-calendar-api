import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKey: process.env.JWT_ACCESS_SECRET_KEY,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  validate({ id, login }) {
    return { id, login };
  }
}
