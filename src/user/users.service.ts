import { ExceptionsService } from '../exception/exceptions.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

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
    const { password, ...user } = await this.getUserByLogin(login);
    const notificationSubscriptions = user.notificationSubscriptions.map(
      ({ endpoint }) => endpoint,
    );

    return { ...user, notificationSubscriptions };
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const trimmedLogin = createUserDto.login.trim();
    const existedUser = await this.userRepository.findOneBy({
      login: trimmedLogin,
    });

    if (existedUser) {
      this.exceptionsService.throwLoginIsBusy();
    }

    const newUser = new User();

    const salt = 10;
    const trimmedPassword = createUserDto.password.trim();
    const passwordHash = await bcrypt.hash(trimmedPassword, salt);

    newUser.firstName = createUserDto.firstName.trim();
    newUser.lastName = createUserDto.lastName.trim();
    newUser.email = createUserDto.email;
    newUser.login = trimmedLogin;
    newUser.password = passwordHash;

    return this.userRepository.save(newUser);
  }
}
