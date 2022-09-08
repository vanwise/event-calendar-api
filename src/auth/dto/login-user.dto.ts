import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginUserDto {
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
