import { TimeService } from '../time/time.service';
import { AuthService } from '../auth/auth.service';
import { ChangeUserPasswordDto } from './dto/change-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ExceptionsService } from '../exceptions/exceptions.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

export interface PublicUser
  extends Omit<User, 'password' | 'nullChecks' | 'notificationSubscriptions'> {
  notificationSubscriptions: string[];
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private exceptionsService: ExceptionsService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private timeService: TimeService,
  ) {}

  getUserByLogin(
    login: string,
    relations?: FindOptionsRelations<User>,
  ): Promise<User> {
    return this.userRepository.findOne({
      where: { login },
      relations: { notificationSubscriptions: true, ...relations },
    });
  }

  async getUser(login: string): Promise<PublicUser> {
    const storedUser = await this.getUserByLogin(login);
    return this.getPublicUser(storedUser);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existedUser = await this.userRepository.findOneBy({
      login: createUserDto.login,
    });

    if (existedUser) {
      this.exceptionsService.throwLoginIsBusy();
    }

    const newUser = new User();

    newUser.firstName = createUserDto.firstName;
    newUser.lastName = createUserDto.lastName;
    newUser.email = createUserDto.email;
    newUser.login = createUserDto.login;
    newUser.password = await this.getPasswordHash(createUserDto.password);
    newUser.passwordChangeDate = this.timeService.getDate().toISOString();

    return this.userRepository.save(newUser);
  }

  async updateUser(
    updateUserDto: UpdateUserDto,
    login: string,
  ): Promise<PublicUser> {
    const storedUser = await this.getUserByLogin(login);

    storedUser.firstName = updateUserDto.firstName;
    storedUser.lastName = updateUserDto.lastName;
    storedUser.email = updateUserDto.email;

    const savedUser = await this.userRepository.save(storedUser);
    return this.getPublicUser(savedUser);
  }

  async changeUserPassword(
    changeUserPasswordDto: ChangeUserPasswordDto,
    login: string,
    res: Response,
  ): Promise<string> {
    const storedUser = await this.getUserByLogin(login);
    const isPasswordConfirmed = await bcrypt.compare(
      changeUserPasswordDto.currentPassword,
      storedUser.password,
    );

    if (!isPasswordConfirmed) {
      this.exceptionsService.throwIncorrectCurrentPassword();
    }

    storedUser.password = await this.getPasswordHash(
      changeUserPasswordDto.newPassword,
    );
    storedUser.passwordChangeDate = this.timeService.getDate().toISOString();

    const savedUser = await this.userRepository.save(storedUser);
    return this.authService.login(savedUser, res);
  }

  private async getPasswordHash(password: string): Promise<string> {
    const salt = 10;
    return await bcrypt.hash(password, salt);
  }

  private getPublicUser(storedUser: User): PublicUser {
    const { password, ...user } = storedUser;
    const notificationSubscriptions = user.notificationSubscriptions.map(
      ({ endpoint }) => endpoint,
    );

    return { ...user, notificationSubscriptions };
  }
}
