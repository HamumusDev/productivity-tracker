import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { Env } from '../config/env';
import { buildDataSourceOptions } from './database.options';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) =>
        buildDataSourceOptions({
          NODE_ENV: config.get('NODE_ENV', { infer: true }),
          DATABASE_URL: config.get('DATABASE_URL', { infer: true }),
        }),
    }),
  ],
})
export class DatabaseModule {}
