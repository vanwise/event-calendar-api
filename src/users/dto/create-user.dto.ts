import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { EmptyStringToNull } from '../../validations/EmptyStringToNull';
import { Trim } from '../../validations/Trim';

export class CreateUserDto {
  @IsString()
  @Trim()
  @IsNotEmpty()
  @ApiProperty({ example: 'John', description: 'User first name' })
  readonly firstName: string;

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

  @IsString()
  @Trim()
  @IsNotEmpty()
  @ApiProperty({ example: 'john_doe', description: 'Unique login' })
  readonly login: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  @Length(4, 16)
  @ApiProperty({ example: '12345_pass', description: 'User password' })
  readonly password: string;
}
