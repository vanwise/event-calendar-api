import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { IsNotEmptyString } from '../../validations/IsNotEmptyString';

export class CreateUserDto {
  @IsNotEmpty()
  @IsNotEmptyString()
  @ApiProperty({ example: 'John', description: 'User first name' })
  readonly firstName: string;

  @IsOptional()
  @IsNotEmptyString()
  @ApiProperty({ example: 'Doe', description: 'User last name' })
  readonly lastName?: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'example@mail.com', description: 'User email' })
  readonly email: string;

  @IsNotEmpty()
  @IsNotEmptyString()
  @ApiProperty({ example: 'john_doe', description: 'Unique login' })
  readonly login: string;

  @IsNotEmpty()
  @IsNotEmptyString()
  @Length(4, 16)
  @ApiProperty({ example: '12345_pass', description: 'User password' })
  readonly password: string;
}
