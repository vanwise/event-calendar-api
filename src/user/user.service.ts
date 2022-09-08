import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { User } from './entities/user.entity';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUser({ login }: GetUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({
      login,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existedUser = await this.userRepository.findOneBy({
      login: createUserDto.login,
    });

    if (existedUser) {
      throw new ConflictException({ login: 'Login is already busy' });
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
