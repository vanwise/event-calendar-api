import { User } from '../users/entities/user.entity';
import { ExceptionsService } from '../exceptions/exceptions.service';
import { UsersService } from '../users/users.service';
import { Injectable } from '@nestjs/common';
import { CreateNotificationSubscriptionDto } from './dto/create-notification-subscription-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationSubscription } from './entities/notification-subscription.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(NotificationSubscription)
    private notificationSubscriptionRepository: Repository<NotificationSubscription>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private usersService: UsersService,
    private exceptionsService: ExceptionsService,
  ) {}

  async createNotificationSubscription(
    { endpoint, keys }: CreateNotificationSubscriptionDto,
    userLogin: string,
  ): Promise<void> {
    const user = await this.usersService.getUserByLogin(userLogin);
    const isUserSubscriptionExist = user.notificationSubscriptions?.some(
      (subscription) => endpoint === subscription.endpoint,
    );

    if (isUserSubscriptionExist) {
      this.exceptionsService.throwSubscriptionIsExist();
    }

    const storedSubscription =
      await this.notificationSubscriptionRepository.findOneBy({
        endpoint,
      });

    if (storedSubscription) {
      user.notificationSubscriptions.push(storedSubscription);
      this.userRepository.save(user);
    } else {
      const subscription = this.notificationSubscriptionRepository.create({
        endpoint,
        keys: {
          p256dh: keys.p256dh,
          auth: keys.auth,
        },
        users: [user],
      });

      this.notificationSubscriptionRepository.save(subscription);
    }
  }

  async removeUserNotificationSubscriptions(userLogin: string): Promise<void> {
    const user = await this.usersService.getUserByLogin(userLogin);

    user.notificationSubscriptions.forEach(async ({ endpoint }) => {
      const storedSubscription =
        await this.notificationSubscriptionRepository.findOne({
          where: { endpoint },
          relations: { users: true },
        });

      if (storedSubscription.users.length === 1) {
        await this.notificationSubscriptionRepository.remove(
          storedSubscription,
        );
      }
    });

    user.notificationSubscriptions = [];
    this.userRepository.save(user);
  }
}
