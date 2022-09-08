import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'John', description: 'User first name' })
  readonly firstName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Doe', description: 'User last name' })
  readonly lastName?: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'example@mail.com', description: 'User email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'john_doe', description: 'Unique login' })
  readonly login: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 16)
  @ApiProperty({ example: '12345_pass', description: 'User password' })
  readonly password: string;
}
