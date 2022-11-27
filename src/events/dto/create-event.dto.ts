import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { IsUndefined } from '../../validations/IsUndefined';
import { EmptyStringToNull } from '../../validations/EmptyStringToNull';
import { Trim } from '../../validations/Trim';

export class CreateEventDto {
  @IsString()
  @Trim()
  @IsNotEmpty()
  @ApiProperty({ example: 'Super event', description: 'Event title' })
  readonly title: string;

  @IsOptional()
  @IsString()
  @Trim()
  @EmptyStringToNull()
  @ApiProperty({
    example: 'This event very cool',
    description: 'Event description',
  })
  readonly description?: string | null;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    example: 'ace9138c-c255-4c1c-98ff-dbc82a6e51a5',
    description: 'Generated tag ID',
  })
  readonly tagId: string;

  @IsUndefined()
  @IsBoolean()
  @ApiProperty({
    description: 'Shows whether the event has a reminder or not',
  })
  readonly hasReminder?: boolean;

  @IsNotEmpty()
  @IsISO8601({ strict: true })
  @ApiProperty({
    example: '2022-09-14T18:00:00.000Z',
    description: 'Event start date',
  })
  readonly startDateISO: string;

  @IsNotEmpty()
  @IsISO8601({ strict: true })
  @ApiProperty({
    example: '2022-09-14T18:00:00.000Z',
    description: 'Event end date',
  })
  readonly endDateISO: string;
}
