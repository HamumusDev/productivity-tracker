import 'reflect-metadata';
import { join } from 'node:path';
import { config as loadDotenv } from 'dotenv';
import { DataSource } from 'typeorm';
import { validate } from '../config/env';
import { buildDataSourceOptions } from './database.options';

loadDotenv({ path: join(__dirname, '..', '..', '..', '..', '.env') });

export default new DataSource(buildDataSourceOptions(validate(process.env)));
