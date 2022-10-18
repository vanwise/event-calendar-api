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
    createNotificationSubscriptionDto: CreateNotificationSubscriptionDto,
    userLogin: string,
  ): Promise<void> {
    const trimmedEndpoint = createNotificationSubscriptionDto.endpoint.trim();
    const user = await this.usersService.getUserByLogin(userLogin);
    const isUserSubscriptionExist = user.notificationSubscriptions?.some(
      ({ endpoint }) => trimmedEndpoint === endpoint,
    );

    if (isUserSubscriptionExist) {
      this.exceptionsService.throwSubscriptionIsExist();
    }

    const storedSubscription =
      await this.notificationSubscriptionRepository.findOneBy({
        endpoint: trimmedEndpoint,
      });

    if (storedSubscription) {
      user.notificationSubscriptions.push(storedSubscription);
      this.userRepository.save(user);
    } else {
      const subscription = this.notificationSubscriptionRepository.create({
        endpoint: trimmedEndpoint,
        keys: {
          p256dh: createNotificationSubscriptionDto.keys.p256dh.trim(),
          auth: createNotificationSubscriptionDto.keys.auth.trim(),
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
