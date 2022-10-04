import { TimeService } from './../time/time.service';
import { Notification } from './entities/notification.entity';
import { UserModule } from './../user/user.module';
import { NotificationSubscription } from './../subscriptions/entities/notification-subscription.entity';
import { TasksService } from '../tasks/tasks.service';
import { ExceptionService } from '../exception/exception.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([NotificationSubscription, Notification]),
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    ExceptionService,
    TasksService,
    TimeService,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
