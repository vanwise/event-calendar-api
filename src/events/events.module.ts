import { UsersModule } from '../users/users.module';
import { TimeService } from '../time/time.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { ExceptionsService } from '../exceptions/exceptions.service';
import { Tag } from '../tags/entities/tag.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Module } from '@nestjs/common';
import { Event } from './entities/event.entity';

@Module({
  imports: [
    NotificationsModule,
    UsersModule,
    TypeOrmModule.forFeature([Event, Tag]),
  ],
  controllers: [EventsController],
  providers: [EventsService, ExceptionsService, TimeService],
})
export class EventsModule {}
