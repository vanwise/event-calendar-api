import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'john_doe', description: 'Unique login' })
  readonly login: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '12345_pass', description: 'User password' })
  readonly password: string;
}
