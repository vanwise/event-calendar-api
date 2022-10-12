import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { IsNotEmptyString } from '../../validations/IsNotEmptyString';

class SubscriptionKeys {
  @IsNotEmpty()
  @IsNotEmptyString()
  @ApiProperty({ description: 'Subscription auth p256dh string' })
  readonly p256dh: string;

  @IsNotEmpty()
  @IsNotEmptyString()
  @ApiProperty({ description: 'Subscription auth string' })
  readonly auth: string;
}

export class CreateNotificationSubscriptionDto {
  @IsNotEmpty()
  @IsNotEmptyString()
  @ApiProperty({ description: 'Subscription endpoint link' })
  readonly endpoint: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: '1000', description: 'Subscription endpoint link' })
  readonly expirationTime?: number | null;

  @IsNotEmpty()
  @Type(() => SubscriptionKeys)
  @ValidateNested()
  @ApiProperty({ description: 'Subscription auth info' })
  readonly keys: SubscriptionKeys;
}
