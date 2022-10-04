import { UserModule } from './../user/user.module';
import { TimeService } from './../time/time.service';
import { NotificationsModule } from './../notifications/notifications.module';
import { ExceptionService } from './../exception/exception.service';
import { Tag } from './../tag/entities/tag.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { Module } from '@nestjs/common';
import { Event } from './entities/event.entity';

@Module({
  imports: [
    NotificationsModule,
    UserModule,
    TypeOrmModule.forFeature([Event, Tag]),
  ],
  controllers: [EventController],
  providers: [EventService, ExceptionService, TimeService],
})
export class EventModule {}
