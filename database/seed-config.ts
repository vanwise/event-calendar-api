import { migrationOptions } from './ormconfig';

export default {
  ...migrationOptions,
  seeds: ['./database/seeds/*.seed.ts'],
};
