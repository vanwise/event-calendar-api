import { ExceptionsService } from '../exception/exceptions.service';
import { User } from './../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/users.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Response } from 'express';
import { THIRTY_DAYS_IN_MS } from './auth.constants';
import * as bcrypt from 'bcrypt';

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
  ) {}

  login(user: User): AuthTokens {
    return this.generateTokens(user);
  }

  async refreshSession(refreshToken: string): Promise<AuthTokens> {
    if (!refreshToken) {
      this.exceptionsService.throwTokenExpired();
    }

    try {
      const { id, login } =
        this.jwtService.verify(refreshToken, {
          secret: process.env.REFRESH_JWT_SECRET_KEY,
        }) || {};

      if (id && login) {
        await this.validateUserByLoginFromJwt(login);
        return this.generateTokens({ id, login });
      }
    } catch {
      this.exceptionsService.throwTokenExpired();
    }
  }

  async registration(createUserDto: CreateUserDto): Promise<AuthTokens> {
    const newUser = await this.usersService.createUser(createUserDto);
    return this.generateTokens(newUser);
  }

  async validateUserByLoginFromJwt(login: string): Promise<User> {
    const existedUser = await this.usersService.getUserByLogin(login);

    if (!existedUser) {
      this.exceptionsService.throwLoginNotFound();
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

  private generateTokens({
    id,
    login,
  }: Pick<User, 'id' | 'login'>): AuthTokens {
    const payload = { id, login };
    const refreshTokenOptions = {
      secret: process.env.REFRESH_JWT_SECRET_KEY,
      expiresIn: '30d',
    };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, refreshTokenOptions),
    };
  }

  setRefreshTokenInCookie(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: THIRTY_DAYS_IN_MS,
    });
  }
}
