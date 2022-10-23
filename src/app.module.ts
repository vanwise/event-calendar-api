import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { NotificationsModule } from './notifications/notifications.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExceptionsService } from './exceptions/exceptions.service';
import { TagsModule } from './tags/tags.module';
import { ScheduleModule } from '@nestjs/schedule';
import {
  ConfigServiceType,
  configValidationSchema,
} from './config/config.utils';

const sslDBOptions = {
  ssl: true,
  extra: {
    ssl: { rejectUnauthorized: false },
  },
};

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: [`.${process.env.NODE_ENV || 'development'}.env`, '.env'],
      isGlobal: true,
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigServiceType) {
        return {
          type: 'postgres',
          port: configService.get('POSTGRES_PORT'),
          username: configService.get('POSTGRES_USER'),
          password: configService.get('POSTGRES_PASSWORD'),
          database: configService.get('POSTGRES_DB'),
          synchronize: false,
          ...(process.env.NODE_ENV === 'development' ? null : sslDBOptions),
          host: configService.get('POSTGRES_HOST'),
          autoLoadEntities: true,
        };
      },
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
