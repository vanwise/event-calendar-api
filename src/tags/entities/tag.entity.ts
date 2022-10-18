import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: 'ace9138c-c255-4c1c-98ff-dbc82a6e51a5',
    description: 'Tag ID',
  })
  id: string;

  @Column('text')
  @ApiProperty({ example: 'Work', description: 'Tag title' })
  title: string;
}
