import { IS_SKIP_JWT_CHECK_KEY } from '../skip-jwt.decorator';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isSkipJwtCheck = this.reflector.getAllAndOverride<boolean>(
      IS_SKIP_JWT_CHECK_KEY,
      [context.getHandler(), context.getClass()],
    );
    return isSkipJwtCheck || super.canActivate(context);
  }

  handleRequest(err, user) {
    if (err || !user) {
      const message = 'Token expired';
      throw err || new UnauthorizedException({ message });
    }
    return user;
  }
}
