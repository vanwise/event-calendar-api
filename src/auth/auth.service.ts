import { LoginUserDto } from './dto/login-user.dto';
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

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(loginUserDto);
    return this.generateToken(user);
  }

  async registration(createUserDto: CreateUserDto) {
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

    return this.generateToken(newUser);
  }

  private async validateUser(loginUserDto: LoginUserDto) {
    const existedUser = await this.userService.getUserByLogin(
      loginUserDto.login,
    );

    if (!existedUser) {
      throw new NotFoundException({
        messages: { login: 'User with this login not found' },
      });
    }

    const isPasswordEqual = await bcrypt.compare(
      loginUserDto.password,
      existedUser.password,
    );

    if (!isPasswordEqual) {
      throw new UnauthorizedException({
        message: 'Incorrect email or password',
      });
    }

    return existedUser;
  }

  private generateToken({ id, login }: User) {
    return {
      token: this.jwtService.sign({ login, id }),
    };
  }
}
