import { join } from 'path';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

dotenv.config({ path: `.development.env` });

export const migrationOptions: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_MIGRATION_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [join(__dirname, '../src/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, './migrations/*.ts')],
  synchronize: false,
};

export default new DataSource(migrationOptions);
