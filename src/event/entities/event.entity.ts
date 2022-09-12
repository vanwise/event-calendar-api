import { Tag } from './../../tag/entities/tag.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
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

  @Column('text')
  @ApiProperty({
    example: 'This event very cool',
    description: 'Event description',
  })
  description: string;

  @Column('uuid')
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

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: string;
}
