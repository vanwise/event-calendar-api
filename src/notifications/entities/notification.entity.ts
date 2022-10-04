import { User } from './../../user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: 'ace9138c-c255-4c1c-98ff-dbc82a6e51a5',
    description: 'Generated notification ID',
  })
  id: string;

  @Column('timestamptz')
  @ApiProperty({
    example: '2022-09-14T18:00:00.000Z',
    description: 'Notification start date',
  })
  startDateISO: Date;

  @Column('text')
  @ApiProperty({
    example: 'Super notification',
    description: 'Notification title',
  })
  title: string;

  @Column('text')
  @ApiProperty({
    example: 'Super notification',
    description: 'Notification description',
  })
  body: string;

  @Column('simple-json', { nullable: true })
  @ApiProperty({
    example: 'Any data',
    description: 'Any notification data',
  })
  data?: any;

  @Column('boolean', { default: false })
  @ApiProperty({ description: 'Indicates that the notification has been read' })
  isRead: boolean;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;
}
