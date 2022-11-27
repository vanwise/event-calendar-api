import { Event } from '../../events/entities/event.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import { NotificationSubscription } from '../../subscriptions/entities/notification-subscription.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: 'ace9138c-c255-4c1c-98ff-dbc82a6e51a5',
    description: 'Generated user ID',
  })
  id: string;

  @Column('text')
  @ApiProperty({ example: 'John', description: 'User first name' })
  firstName: string;

  @Column('text', { nullable: true })
  @ApiProperty({ example: 'Doe', description: 'User last name' })
  lastName: string | null;

  @Column('text', { nullable: true })
  @ApiProperty({ example: 'example@mail.com', description: 'User email' })
  email: string | null;

  @Column('text', { unique: true })
  @ApiProperty({ example: 'john_doe', description: 'Unique login' })
  login: string;

  @Column('text')
  @ApiProperty({ example: 'fasld1i23c90', description: 'User password hash' })
  password: string;

  @OneToMany(() => Notification, (notification) => notification.user)
  @ApiProperty({ type: Notification, isArray: true })
  notifications: Notification[];

  @ManyToMany(
    () => NotificationSubscription,
    (subscription) => subscription.users,
  )
  @ApiProperty({ type: NotificationSubscription, isArray: true })
  notificationSubscriptions: NotificationSubscription[];

  @OneToMany(() => Event, (event) => event.user)
  @ApiProperty({ type: Event, isArray: true })
  events: Event[];

  @Column('timestamptz')
  @ApiProperty({
    example: '2022-09-14T18:00:00.000Z',
    description: 'User password change date',
  })
  passwordChangeDate: string;

  @CreateDateColumn({ type: 'timestamptz' })
  @ApiProperty({
    example: '2022-09-14T18:00:00.000Z',
    description: 'User creating date',
  })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  @ApiProperty({
    example: '2022-09-14T18:00:00.000Z',
    description: 'User updating date',
  })
  updatedAt: string;
}
