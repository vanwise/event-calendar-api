import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Trim } from '../../validations/Trim';
import { EmptyStringToNull } from '../../validations/EmptyStringToNull';
import { IsUndefined } from '../../validations/IsUndefined';

export class UpdateUserDto {
  @IsUndefined()
  @IsString()
  @Trim()
  @IsNotEmpty()
  @ApiProperty({ example: 'John', description: 'User first name' })
  readonly firstName?: string;

  @IsOptional()
  @IsString()
  @Trim()
  @EmptyStringToNull()
  @ApiProperty({ example: 'Doe', description: 'User last name' })
  readonly lastName?: string | null;

  @IsOptional()
  @IsString()
  @Trim()
  @EmptyStringToNull()
  @IsEmail()
  @ApiProperty({ example: 'example@mail.com', description: 'User email' })
  readonly email?: string | null;
}
