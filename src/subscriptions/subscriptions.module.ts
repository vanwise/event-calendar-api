import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { ExceptionsService } from '../exceptions/exceptions.service';
import { NotificationSubscription } from './entities/notification-subscription.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([NotificationSubscription, User]),
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, ExceptionsService],
})
export class SubscriptionsModule {}
