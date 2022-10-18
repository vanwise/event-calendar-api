import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';
import { IsNotEmptyString } from '../../validations/IsNotEmptyString';
import { NotMatch } from 'src/validations/NotMatch';

export class ChangeUserPasswordDto {
  @IsNotEmpty()
  @IsNotEmptyString()
  @Length(4, 16)
  @ApiProperty({ example: '12345_pass', description: 'Current user password' })
  readonly currentPassword: string;

  @IsNotEmpty()
  @IsNotEmptyString()
  @Length(4, 16)
  @NotMatch(ChangeUserPasswordDto, 'currentPassword')
  @ApiProperty({ example: '12345_pass', description: 'New user password' })
  readonly newPassword: string;
}
