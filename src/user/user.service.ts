import { ExceptionService } from './../exception/exception.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';

export interface PublicUser
  extends Omit<User, 'password' | 'nullChecks' | 'notificationSubscriptions'> {
  notificationSubscriptions: string[];
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private exceptionService: ExceptionService,
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
    const existedUser = await this.userRepository.findOneBy({
      login: createUserDto.login,
    });

    if (existedUser) {
      this.exceptionService.throwLoginIsBusy();
    }

    const newUser = new User();

    newUser.firstName = createUserDto.firstName;
    newUser.lastName = createUserDto.lastName;
    newUser.email = createUserDto.email;
    newUser.login = createUserDto.login;
    newUser.password = createUserDto.password;

    return this.userRepository.save(newUser);
  }
}
