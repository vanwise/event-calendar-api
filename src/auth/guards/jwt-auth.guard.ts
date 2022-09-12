import { ExceptionService } from './../../exception/exception.service';
import { IS_SKIP_JWT_CHECK_KEY } from '../skip-jwt.decorator';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private exceptionService: ExceptionService,
  ) {
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
      throw err || this.exceptionService.throwTokenExpired();
    }
    return user;
  }
}
