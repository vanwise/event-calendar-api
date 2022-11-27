import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Trim } from '../../validations/Trim';
import { NotMatch } from '../../validations/NotMatch';

export class ChangeUserPasswordDto {
  @IsString()
  @Trim()
  @IsNotEmpty()
  @Length(4, 16)
  @ApiProperty({ example: '12345_pass', description: 'Current user password' })
  readonly currentPassword: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  @Length(4, 16)
  @NotMatch(ChangeUserPasswordDto, 'currentPassword')
  @ApiProperty({ example: '12345_pass', description: 'New user password' })
  readonly newPassword: string;
}
