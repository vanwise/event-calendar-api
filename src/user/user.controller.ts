import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Getting user' })
  @ApiResponse({ status: HttpStatus.OK, type: User })
  getUser(@Req() req: Request) {
    const login = (req.user as User).login;
    return this.userService.getUser(login);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-Type', 'application/json')
  @ApiOperation({ summary: 'Creating user' })
  @ApiResponse({ status: HttpStatus.CREATED, type: User })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
