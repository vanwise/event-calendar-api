import { ExceptionsService } from '../../exception/exceptions.service';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private exceptionsService: ExceptionsService) {
    super();
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw err || this.exceptionsService.throwIncorrectLogInData();
    }
    return user;
  }
}
