import { User } from '../user/entities/user.entity';
import { ExceptionService } from '../exception/exception.service';
import { UserService } from '../user/user.service';
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
    private userService: UserService,
    private exceptionService: ExceptionService,
  ) {}

  async createNotificationSubscription(
    createNotificationSubscriptionDto: CreateNotificationSubscriptionDto,
    userLogin: string,
  ): Promise<void> {
    const user = await this.userService.getUserByLogin(userLogin);
    const isUserSubscriptionExist = user.notificationSubscriptions?.some(
      ({ endpoint }) => createNotificationSubscriptionDto.endpoint === endpoint,
    );

    if (isUserSubscriptionExist) {
      this.exceptionService.throwSubscriptionIsExist();
    }

    const storedSubscription =
      await this.notificationSubscriptionRepository.findOneBy({
        endpoint: createNotificationSubscriptionDto.endpoint,
      });

    if (storedSubscription) {
      user.notificationSubscriptions.push(storedSubscription);
      this.userRepository.save(user);
    } else {
      const subscription = this.notificationSubscriptionRepository.create({
        ...createNotificationSubscriptionDto,
        users: [user],
      });

      this.notificationSubscriptionRepository.save(subscription);
    }
  }

  async removeUserNotificationSubscriptions(userLogin: string): Promise<void> {
    const user = await this.userService.getUserByLogin(userLogin);

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
