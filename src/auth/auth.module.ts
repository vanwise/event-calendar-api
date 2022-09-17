import { ExceptionService } from './../exception/exception.service';
import { LocalStrategy } from './strategies/local.strategy';
import { UserModule } from './../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.ACCESS_JWT_SECRET_KEY,
      signOptions: { expiresIn: '30m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, ExceptionService],
  exports: [AuthService],
})
export class AuthModule {}
