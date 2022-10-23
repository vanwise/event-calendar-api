import { ConfigService, ConfigModule } from '@nestjs/config';
import { ConfigServiceType } from '../config/config.utils';
import { TimeService } from './../time/time.service';
import { ExceptionsService } from '../exceptions/exceptions.service';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigServiceType) {
        return {
          secret: configService.get('ACCESS_JWT_SECRET_KEY'),
          signOptions: { expiresIn: '30m' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    ExceptionsService,
    TimeService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
