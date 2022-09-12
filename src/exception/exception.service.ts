import {
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';

export class ExceptionService {
  throwTokenExpired() {
    throw new UnauthorizedException({ message: 'Token expired' });
  }

  throwIncorrectLogInData() {
    throw new ForbiddenException({ message: 'Incorrect login or password' });
  }

  throwLoginNotFound() {
    throw new UnauthorizedException({
      message: 'User with this login not found',
    });
  }

  throwLoginIsBusy() {
    throw new ConflictException({
      messages: { login: 'Login is already busy' },
    });
  }
}
