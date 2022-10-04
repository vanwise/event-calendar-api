import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class SubscriptionKeys {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Subscription auth p256dh string' })
  readonly p256dh: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Subscription auth string' })
  readonly auth: string;
}

export class CreateNotificationSubscriptionDto {
  @IsNotEmpty()
  @IsString()
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
