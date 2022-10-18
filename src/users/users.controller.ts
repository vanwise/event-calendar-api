import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangeUserPasswordDto } from './dto/change-user-password.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Getting user' })
  @ApiResponse({ status: HttpStatus.OK, type: User })
  getUser(@Req() req: Request) {
    const login = (req.user as User).login;
    return this.usersService.getUser(login);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-Type', 'application/json')
  @ApiOperation({ summary: 'Creating user' })
  @ApiResponse({ status: HttpStatus.CREATED, type: User })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Patch()
  @ApiOperation({ summary: 'Updating user' })
  @ApiResponse({ status: HttpStatus.OK, type: User })
  updateUser(@Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    const login = (req.user as User).login;
    return this.usersService.updateUser(updateUserDto, login);
  }

  @Patch('change-password')
  @ApiOperation({ summary: 'Changing user password' })
  @ApiResponse({ status: HttpStatus.OK })
  async changeUserPassword(
    @Body() changeUserPasswordDto: ChangeUserPasswordDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const login = (req.user as User).login;
    const accessToken = await this.usersService.changeUserPassword(
      changeUserPasswordDto,
      login,
      res,
    );

    res.send({ accessToken });
  }
}
