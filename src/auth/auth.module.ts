import { ExceptionsService } from '../exception/exceptions.service';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from '../user/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.ACCESS_JWT_SECRET_KEY,
      signOptions: { expiresIn: '30m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, ExceptionsService],
  exports: [AuthService],
})
export class AuthModule {}
