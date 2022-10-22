import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { NotificationsModule } from './notifications/notifications.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ExceptionsService } from './exceptions/exceptions.service';
import { TagsModule } from './tags/tags.module';
import { ScheduleModule } from '@nestjs/schedule';
import { commonDBOptions } from './app.utils';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRoot({
      ...commonDBOptions,
      host: process.env.POSTGRES_HOST,
      autoLoadEntities: true,
    }),
    EventsModule,
    UsersModule,
    AuthModule,
    TagsModule,
    SubscriptionsModule,
    NotificationsModule,
  ],
  providers: [
    ExceptionsService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
