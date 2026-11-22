import { join } from 'node:path';
import type { DataSourceOptions } from 'typeorm';
import type { Env } from '../config/env';
import { entities } from './entities';

export type DatabaseEnv = Pick<Env, 'DATABASE_URL' | 'NODE_ENV'>;

export function buildDataSourceOptions(env: DatabaseEnv): DataSourceOptions {
  return {
    type: 'postgres',
    url: env.DATABASE_URL,
    entities,
    migrations: [join(__dirname, 'migrations', '*.js')],
    synchronize: false,
    migrationsRun: false,
    logging: env.NODE_ENV === 'development' ? ['error', 'warn', 'migration'] : ['error'],
  };
}
