import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { IsNotEmptyString } from '../../validations/IsNotEmptyString';

export class UpdateEventDto {
  @IsOptional()
  @IsNotEmptyString()
  @ApiProperty({ example: 'Super event', description: 'Event title' })
  readonly title?: string;

  @IsOptional()
  @IsNotEmptyString()
  @ApiProperty({
    example: 'This event very cool',
    description: 'Event description',
  })
  readonly description?: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    example: 'ace9138c-c255-4c1c-98ff-dbc82a6e51a5',
    description: 'Generated tag ID',
  })
  readonly tagId?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Shows whether the event has a reminder or not',
  })
  readonly hasReminder?: boolean;

  @IsOptional()
  @IsString()
  @IsISO8601({ strict: true })
  @ApiProperty({
    example: '2022-09-14T18:00:00.000Z',
    description: 'Event start date',
  })
  readonly startDateISO?: string;

  @IsOptional()
  @IsString()
  @IsISO8601({ strict: true })
  @ApiProperty({
    example: '2022-09-14T18:00:00.000Z',
    description: 'Event end date',
  })
  readonly endDateISO?: string;
}
