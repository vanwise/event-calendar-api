import { User } from '../user/entities/user.entity';
import { CreateNotificationSubscriptionDto } from './dto/create-notification-subscription-dto';
import { SubscriptionsService } from './subscriptions.service';
import {
  Body,
  Controller,
  Delete,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('subscriptions')
@ApiTags('Notification subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Post('notifications')
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-Type', 'application/json')
  @ApiOperation({ summary: 'Creating notifications subscription' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async createNotificationSubscription(
    @Body()
    createNotificationSubscriptionDto: CreateNotificationSubscriptionDto,
    @Req() req: Request,
  ) {
    const userLogin = (req.user as User).login;
    await this.subscriptionsService.createNotificationSubscription(
      createNotificationSubscriptionDto,
      userLogin,
    );
  }

  @Delete('notifications')
  @ApiOperation({ summary: 'Removing notifications subscription' })
  @ApiResponse({ status: HttpStatus.OK })
  async removeUserNotificationSubscriptions(@Req() req: Request) {
    const userLogin = (req.user as User).login;
    await this.subscriptionsService.removeUserNotificationSubscriptions(
      userLogin,
    );
  }
}
