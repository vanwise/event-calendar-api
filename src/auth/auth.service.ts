import { ConfigService } from '@nestjs/config';
import { ConfigServiceType } from '../config/config.utils';
import { TimeService } from './../time/time.service';
import { ExceptionsService } from '../exceptions/exceptions.service';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Response } from 'express';
import { THIRTY_DAYS_IN_MS } from './auth.constants';
import * as bcrypt from 'bcrypt';

type GenerateTokenArgs = Pick<User, 'id' | 'login'>;
export interface TokenPayload {
  id: string;
  login: string;
  iat: number;
  exp: number;
}
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private exceptionsService: ExceptionsService,
    private timeService: TimeService,
    @Inject(ConfigService)
    private configService: ConfigServiceType,
  ) {}

  login(user: User, res: Response): string {
    return this.getAccessTokenAndSetRefreshToCookie(user, res);
  }

  async refreshSession(refreshToken: string, res: Response): Promise<string> {
    if (!refreshToken) {
      this.exceptionsService.throwTokenExpired();
    }

    try {
      const { id, login, iat } =
        this.jwtService.verify<TokenPayload>(refreshToken, {
          secret: this.configService.get('REFRESH_JWT_SECRET_KEY'),
        }) || {};

      if (id && login) {
        await this.validateUserByLoginFromJwt(login, iat);
        return this.getAccessTokenAndSetRefreshToCookie({ id, login }, res);
      }
    } catch {
      this.exceptionsService.throwTokenExpired();
    }
  }

  async registration(
    createUserDto: CreateUserDto,
    res: Response,
  ): Promise<string> {
    const newUser = await this.usersService.createUser(createUserDto);
    return this.getAccessTokenAndSetRefreshToCookie(newUser, res);
  }

  async validateUserByLoginFromJwt(
    login: string,
    tokenCreatedDatInMs: number,
  ): Promise<User> {
    const existedUser = await this.usersService.getUserByLogin(login);

    if (!existedUser) {
      this.exceptionsService.throwLoginNotFound();
    }

    const passwordChangeDate = this.timeService.getDate(
      existedUser.passwordChangeDate,
    );
    const isPasswordExpired = passwordChangeDate.unix() > tokenCreatedDatInMs;

    if (isPasswordExpired) {
      this.exceptionsService.throwIncorrectLogInData();
    }

    return existedUser;
  }

  async validateUser(login: string, password: string): Promise<User> {
    const existedUser = await this.usersService.getUserByLogin(login);

    if (!existedUser) {
      this.exceptionsService.throwIncorrectLogInData();
    }

    const isPasswordEqual = await bcrypt.compare(
      password,
      existedUser.password,
    );

    if (!isPasswordEqual) {
      this.exceptionsService.throwIncorrectLogInData();
    }

    return existedUser;
  }

  private getAccessTokenAndSetRefreshToCookie(
    userData: GenerateTokenArgs,
    res: Response,
  ): string {
    const { accessToken, refreshToken } = this.generateTokens(userData);
    const isDev = process.env.NODE_ENV === 'development';

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: THIRTY_DAYS_IN_MS,
      ...(isDev ? null : { secure: true, sameSite: 'none' }),
    });

    return accessToken;
  }

  private generateTokens({ id, login }: GenerateTokenArgs): AuthTokens {
    const payload = { id, login };
    const refreshTokenOptions = {
      secret: this.configService.get('REFRESH_JWT_SECRET_KEY'),
      expiresIn: '30d',
    };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, refreshTokenOptions),
    };
  }
}
