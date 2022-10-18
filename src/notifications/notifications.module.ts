import { TimeService } from './../time/time.service';
import { Notification } from './entities/notification.entity';
import { UsersModule } from '../users/users.module';
import { NotificationSubscription } from './../subscriptions/entities/notification-subscription.entity';
import { TasksService } from '../tasks/tasks.service';
import { ExceptionsService } from '../exceptions/exceptions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([NotificationSubscription, Notification]),
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    ExceptionsService,
    TasksService,
    TimeService,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
