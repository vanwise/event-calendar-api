import { User } from './../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './../user/user.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { THIRTY_DAYS } from './auth.constant';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  login(user: User): AuthTokens {
    return this.generateTokens(user);
  }

  refreshSession(refreshToken: string): AuthTokens {
    const message = 'Token expired';

    if (!refreshToken) {
      throw new UnauthorizedException({ message });
    }

    const { id, login } =
      this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET_KEY,
      }) || {};

    if (id && login) {
      return this.generateTokens({ id, login });
    }

    throw new UnauthorizedException({ message });
  }

  async registration(createUserDto: CreateUserDto): Promise<AuthTokens> {
    const existedUser = await this.userService.getUserByLogin(
      createUserDto.login,
    );

    if (existedUser) {
      throw new ConflictException({
        messages: { login: 'Login is already busy' },
      });
    }

    const salt = 10;
    const passwordHash = await bcrypt.hash(createUserDto.password, salt);
    const newUser = await this.userService.createUser({
      ...createUserDto,
      password: passwordHash,
    });

    return this.generateTokens(newUser);
  }

  async validateUser(login: string, password: string): Promise<User> {
    const existedUser = await this.userService.getUserByLogin(login);

    if (!existedUser) {
      throw new NotFoundException({
        messages: { login: 'User with this login not found' },
      });
    }

    const isPasswordEqual = await bcrypt.compare(
      password,
      existedUser.password,
    );

    if (!isPasswordEqual) {
      throw new UnauthorizedException({
        message: 'Incorrect login or password',
      });
    }

    return existedUser;
  }

  private generateTokens({
    id,
    login,
  }: Pick<User, 'id' | 'login'>): AuthTokens {
    const payload = { id, login };
    const refreshTokenOptions = {
      secret: process.env.JWT_REFRESH_SECRET_KEY,
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
      maxAge: THIRTY_DAYS,
    });
  }
}
