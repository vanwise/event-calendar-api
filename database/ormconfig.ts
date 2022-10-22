import { join } from 'path';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { commonDBOptions } from '../src/app.utils';

export const migrationOptions: PostgresConnectionOptions = {
  ...commonDBOptions,
  host: process.env.POSTGRES_MIGRATION_HOST,
  entities: [join(__dirname, '../src/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, './migrations/*.ts')],
};

export default new DataSource(migrationOptions);
