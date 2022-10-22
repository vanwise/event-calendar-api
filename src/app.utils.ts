import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import * as dotenv from 'dotenv';

dotenv.config({ path: `.${process.env.NODE_ENV}.env` });

const sslDBOptions = {
  ssl: true,
  extra: {
    ssl: { rejectUnauthorized: false },
  },
};

export const commonDBOptions: PostgresConnectionOptions = {
  type: 'postgres',
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  ...(process.env.NODE_ENV === 'development' ? null : sslDBOptions),
};
