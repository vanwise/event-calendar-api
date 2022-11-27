import { join } from 'path';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const nodeEnv = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.${nodeEnv}.env` });

const sslDBOptions = {
  ssl: true,
  extra: {
    ssl: { rejectUnauthorized: false },
  },
};

export const migrationOptions: PostgresConnectionOptions = {
  type: 'postgres',
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_MIGRATION_HOST,
  ...(nodeEnv === 'development' ? null : sslDBOptions),
  entities: [join(__dirname, '../src/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, './migrations/*.ts')],
};

export default new DataSource(migrationOptions);
