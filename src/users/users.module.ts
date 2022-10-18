import { TimeService } from '../time/time.service';
import { AuthModule } from '../auth/auth.module';
import { ExceptionsService } from '../exceptions/exceptions.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, ExceptionsService, TimeService],
  exports: [UsersService],
})
export class UsersModule {}
