import { ExceptionService } from './../exception/exception.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private exceptionService: ExceptionService,
  ) {}

  getUserByLogin(login: string): Promise<User> {
    return this.userRepository.findOneBy({
      login,
    });
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
