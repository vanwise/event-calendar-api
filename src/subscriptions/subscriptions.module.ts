import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { ExceptionService } from '../exception/exception.service';
import { NotificationSubscription } from './entities/notification-subscription.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([NotificationSubscription, User]),
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, ExceptionService],
})
export class SubscriptionsModule {}
