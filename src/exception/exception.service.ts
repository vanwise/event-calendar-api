import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
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

  throwTagNotFound() {
    throw new ConflictException({
      messages: { tagId: 'There is no tag with this id' },
    });
  }

  throwSubscriptionIsExist() {
    throw new ConflictException({
      message: 'User is already subscribe to notifications',
    });
  }

  throwUserWithoutSubscription() {
    throw new ConflictException({
      message: 'User not have any notification subscriptions yet',
    });
  }

  throwEventNotFound() {
    throw new NotFoundException({
      message: 'Event being updated does not exist',
    });
  }
}
