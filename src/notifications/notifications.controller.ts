import { Notification } from './entities/notification.entity';
import { User } from '../users/entities/user.entity';
import { NotificationsService } from './notifications.service';
import { Controller, Get, Param, Post, Req, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('notifications')
@ApiTags('Notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Getting all notifications' })
  @ApiResponse({ status: HttpStatus.OK, type: Notification, isArray: true })
  getAllNotifications(@Req() req: Request) {
    const userId = (req.user as User).id;
    return this.notificationsService.getAllNotifications(userId);
  }

  @Post('read')
  @ApiOperation({ summary: 'Reading all notifications' })
  @ApiResponse({ status: HttpStatus.OK })
  readAllNotifications(@Req() req: Request) {
    const userId = (req.user as User).id;
    this.notificationsService.readAllNotifications(userId);
  }

  @Post('read/:id')
  @ApiOperation({ summary: 'Reading one notification' })
  @ApiResponse({ status: HttpStatus.OK })
  readNotification(@Param('id') id: string) {
    this.notificationsService.readNotification(id);
  }
}
