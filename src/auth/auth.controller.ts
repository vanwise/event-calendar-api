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
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SkipJwtCheck } from './skip-jwt.decorator';
import { Request, Response } from 'express';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @SkipJwtCheck()
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({ status: HttpStatus.OK })
  login(@Req() req: Request, @Res() res: Response) {
    const { accessToken, refreshToken } = this.authService.login(
      req.user as User,
    );

    this.authService.setRefreshTokenInCookie(res, refreshToken);
    res.send({ accessToken });
  }

  @Post('registration')
  @SkipJwtCheck()
  @ApiOperation({ summary: 'Sign up' })
  @ApiResponse({ status: HttpStatus.OK })
  async registration(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.registration(
      createUserDto,
    );

    this.authService.setRefreshTokenInCookie(res, refreshToken);
    res.send({ accessToken });
  }

  @Post('refresh')
  @SkipJwtCheck()
  @ApiOperation({ summary: 'Refreshing token' })
  @ApiResponse({ status: HttpStatus.OK })
  refreshSession(@Req() req: Request, @Res() res: Response) {
    const { accessToken, refreshToken } = this.authService.refreshSession(
      req.cookies.refreshToken,
    );

    this.authService.setRefreshTokenInCookie(res, refreshToken);
    res.send({ accessToken });
  }
}
