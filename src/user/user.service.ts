import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
      throw new ConflictException({
        messages: { login: 'Login is already busy' },
      });
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
