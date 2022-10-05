import { TimeService } from './../time/time.service';
import { User } from './../user/entities/user.entity';
import { Notification } from './entities/notification.entity';
import { NotificationSubscription } from './../subscriptions/entities/notification-subscription.entity';
import { UNSUBSCRIBED_CODE } from './notifications.constants';
import { TasksService } from '../tasks/tasks.service';
import { ExceptionsService } from '../exception/exceptions.service';
import { UsersService } from '../user/users.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import * as webpush from 'web-push';

type IncomingNotification = Pick<
  Notification,
  'title' | 'body' | 'data' | 'startDateISO'
>;
interface AddUserNotificationTaskArgs {
  user: User;
  notification: IncomingNotification;
  taskName: string;
  delayInMs: number;
}
interface CreateNotificationArgs
  extends Omit<AddUserNotificationTaskArgs, 'user'> {
  userLogin: string;
}
interface WebPushRejectedResult extends webpush.SendResult {
  endpoint: string;
}
type SubscriptionForFind = Record<'endpoint', string>;

@Injectable()
export class NotificationsService implements OnModuleInit {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    @InjectRepository(NotificationSubscription)
    private notificationSubscriptionRepository: Repository<NotificationSubscription>,
    private usersService: UsersService,
    private exceptionsService: ExceptionsService,
    private tasksService: TasksService,
    private timeService: TimeService,
  ) {
    webpush.setVapidDetails(
      `mailto:${process.env.WEB_PUSH_CONTACT_EMAIL}`,
      process.env.PUBLIC_VAPID_KEY,
      process.env.PRIVATE_VAPID_KEY,
    );
  }

  async onModuleInit(): Promise<void> {
    const notifications = await this.notificationsRepository.find({
      relations: ['user', 'user.notificationSubscriptions'],
    });

    notifications.forEach(async ({ id, user, title, body, startDateISO }) => {
      const startDate = this.timeService.getDate(startDateISO);
      const diffFromNowToStartNotification = startDate.diff(
        this.timeService.getDate(),
        'milliseconds',
      );

      if (diffFromNowToStartNotification > 0) {
        await this.addUserNotificationTask({
          user,
          taskName: id,
          delayInMs: diffFromNowToStartNotification,
          notification: { title, body, startDateISO },
        });
      }
    });
  }

  async getAllNotifications(userId: string): Promise<Notification[]> {
    return await this.notificationsRepository.findBy({
      startDateISO: LessThan(this.timeService.getDate().toDate()),
      user: { id: userId },
    });
  }

  async readAllNotifications(userId: string): Promise<void> {
    const unreadedNotifications = await this.notificationsRepository.findBy({
      isRead: false,
      user: { id: userId },
    });

    unreadedNotifications.forEach((notification) => {
      notification.isRead = true;
    });
    await this.notificationsRepository.save(unreadedNotifications);
  }

  async readNotification(id: string): Promise<void> {
    const notification = await this.notificationsRepository.findOneBy({
      id,
    });

    notification.isRead = true;
    await this.notificationsRepository.save(notification);
  }

  async createNotification({
    taskName,
    delayInMs,
    userLogin,
    notification,
  }: CreateNotificationArgs): Promise<Notification> {
    const user = await this.usersService.getUserByLogin(userLogin);

    if (!user.notificationSubscriptions.length) {
      this.exceptionsService.throwUserWithoutSubscription();
    }

    const notificationEntity = this.notificationsRepository.create({
      ...notification,
      user,
    });
    const savedNotification = await this.notificationsRepository.save(
      notificationEntity,
    );

    const currentNotification = {
      ...notification,
      data: {
        ...(notification.data || null),
        notificationId: savedNotification.id,
      },
    };

    await this.addUserNotificationTask({
      user,
      taskName,
      delayInMs,
      notification: currentNotification,
    });
    return savedNotification;
  }

  async removeNotification(
    notificationId: string,
    taskName: string,
  ): Promise<void> {
    await this.notificationsRepository.delete(notificationId);
    this.tasksService.deleteTimeout(taskName);
  }

  private async addUserNotificationTask({
    user,
    taskName,
    delayInMs,
    notification,
  }: AddUserNotificationTaskArgs): Promise<void> {
    const notifyUser = async () => {
      const notificationsPromises = user.notificationSubscriptions.map(
        (subscription) =>
          webpush.sendNotification(subscription, JSON.stringify(notification)),
      );
      const sendNotificationsResults = await Promise.allSettled(
        notificationsPromises,
      );

      await this.removeInvalidSubscriptions(sendNotificationsResults);
      this.tasksService.deleteTimeout(taskName);
    };

    this.tasksService.addTimeout(taskName, delayInMs, notifyUser);
  }

  private async removeInvalidSubscriptions(
    results: PromiseSettledResult<webpush.SendResult>[],
  ): Promise<void> {
    const invalidSubscriptions = results.reduce(
      (acc: SubscriptionForFind[], result) => {
        if (result.status === 'rejected') {
          const { statusCode, endpoint } =
            result.reason as WebPushRejectedResult;

          if (statusCode == UNSUBSCRIBED_CODE) {
            acc.push({ endpoint });
          }
        }
        return acc;
      },
      [],
    );

    if (invalidSubscriptions.length) {
      const storedSubscriptions =
        await this.notificationSubscriptionRepository.findBy(
          invalidSubscriptions,
        );
      await this.notificationSubscriptionRepository.remove(storedSubscriptions);
    }
  }
}
