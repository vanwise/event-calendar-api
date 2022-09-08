import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
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

  @Column('text')
  @ApiProperty({ example: 'Doe', description: 'User last name' })
  lastName: string;

  @Column('text')
  @ApiProperty({ example: 'example@mail.com', description: 'User email' })
  email: string;

  @Column('text')
  @ApiProperty({ example: 'john_doe', description: 'Unique login' })
  login: string;

  @Column('text')
  @ApiProperty({ example: 'fasld1i23c90', description: 'User password hash' })
  password: string;

  @CreateDateColumn({ type: 'timestamptz' })
  @ApiProperty({
    example: '2022-09-14T18:00:00.000Z',
    description: 'Event start date',
  })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  @ApiProperty({
    example: '2022-09-14T18:00:00.000Z',
    description: 'Event end date',
  })
  updatedAt: string;
}
