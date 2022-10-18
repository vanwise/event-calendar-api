import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { IsNotEmptyString } from '../../validations/IsNotEmptyString';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsNotEmptyString()
  @ApiProperty({ example: 'John', description: 'User first name' })
  readonly firstName?: string;

  @IsOptional()
  @IsNotEmptyString()
  @ApiProperty({ example: 'Doe', description: 'User last name' })
  readonly lastName?: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'example@mail.com', description: 'User email' })
  readonly email?: string;
}
