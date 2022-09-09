import { User } from './../user/entities/user.entity';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from './../user/dto/create-user.dto';
import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SkipJwtCheck } from './skip-jwt.decorator';
import { Request } from 'express';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @SkipJwtCheck()
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({ status: HttpStatus.OK })
  login(@Req() req: Request) {
    return this.authService.login(req.user as User);
  }

  @Post('registration')
  @SkipJwtCheck()
  @ApiOperation({ summary: 'Sign up' })
  @ApiResponse({ status: HttpStatus.OK })
  registration(@Body() createUserDto: CreateUserDto) {
    return this.authService.registration(createUserDto);
  }
}
