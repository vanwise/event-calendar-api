import { User } from './../../user/entities/user.entity';
import { Notification } from './../../notifications/entities/notification.entity';
import { Tag } from './../../tag/entities/tag.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: 'ace9138c-c255-4c1c-98ff-dbc82a6e51a5',
    description: 'Generated event ID',
  })
  id: string;

  @Column('text')
  @ApiProperty({ example: 'Super event', description: 'Event title' })
  title: string;

  @Column('text', { nullable: true })
  @ApiProperty({
    example: 'This event very cool',
    description: 'Event description',
  })
  description: string | null;

  @Column('uuid')
  @ApiProperty({
    example: 'ace9138c-c255-4c1c-98ff-dbc82a6e51a5',
    description: 'Generated tag ID',
  })
  tagId: string;

  @ManyToOne(() => Tag)
  tag: Tag;

  @Column('timestamptz')
  @ApiProperty({
    example: '2022-09-14T18:00:00.000Z',
    description: 'Event start date',
  })
  startDateISO: Date;

  @Column('timestamptz')
  @ApiProperty({
    example: '2022-09-14T18:00:00.000Z',
    description: 'Event end date',
  })
  endDateISO: Date;

  @Column('uuid', { nullable: true })
  @ApiProperty({
    example: 'ace9138c-c255-4c1c-98ff-dbc82a6e51a5',
    description: 'Generated notification ID',
  })
  notificationId: string | null;

  @OneToOne(() => Notification)
  @JoinColumn()
  notification: Notification;

  @ManyToOne(() => User, (user) => user.events)
  @ApiProperty({ type: () => User })
  user: User;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: string;
}
