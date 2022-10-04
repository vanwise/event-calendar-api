import { User } from '../../user/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('notificationSubscriptions')
export class NotificationSubscription {
  @PrimaryColumn({ unique: true })
  @ApiProperty({ description: 'Subscription endpoint link' })
  endpoint: string;

  @Column('integer', { nullable: true })
  @ApiProperty({ description: 'Subscription expiration time' })
  expirationTime: number | null;

  @Column('simple-json')
  @ApiProperty({
    example: { p256dh: 'Auth string', auth: 'Auth string' },
    description: 'Subscription auth info',
  })
  keys: { p256dh: string; auth: string };

  @ManyToMany(() => User, (user) => user.notificationSubscriptions)
  @JoinTable({
    name: 'notificationSubscriptionsUsers',
    joinColumn: {
      name: 'subscriptionEndpoint',
      referencedColumnName: 'endpoint',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
  })
  users: User[];
}
