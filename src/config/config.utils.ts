import { ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

export interface EnvVariables {
  PORT: number;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;

  POSTGRES_PORT: number;
  POSTGRES_HOST: string;
  POSTGRES_MIGRATION_HOST: string;

  ACCESS_JWT_SECRET_KEY: string;
  REFRESH_JWT_SECRET_KEY: string;
  COOKIE_SECRET: string;
  CLIENT_URL: string;

  PUBLIC_VAPID_KEY: string;
  PRIVATE_VAPID_KEY: string;
  WEB_PUSH_CONTACT_EMAIL: string;
}

export const configValidationSchema = Joi.object<EnvVariables>({
  PORT: Joi.number().default(3001),

  POSTGRES_USER: Joi.string(),
  POSTGRES_PASSWORD: Joi.string(),
  POSTGRES_DB: Joi.string(),

  POSTGRES_PORT: Joi.number().default(5432),
  POSTGRES_HOST: Joi.string(),
  POSTGRES_MIGRATION_HOST: Joi.string(),

  ACCESS_JWT_SECRET_KEY: Joi.string(),
  REFRESH_JWT_SECRET_KEY: Joi.string(),
  COOKIE_SECRET: Joi.string(),
  CLIENT_URL: Joi.string(),

  PUBLIC_VAPID_KEY: Joi.string(),
  PRIVATE_VAPID_KEY: Joi.string(),
  WEB_PUSH_CONTACT_EMAIL: Joi.string(),
});

export type ConfigServiceType = ConfigService<EnvVariables>;
