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

  login(user: User) {
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

  private generateToken({ id, login }: User) {
    return {
      accessToken: this.jwtService.sign({ id, login }),
    };
  }
}
