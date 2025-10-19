// backend-app/data-source.ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './src/users/user.entity';
import { Insight } from './src/insights/insight.entity'; // <-- import Insight entity

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: true,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  entities: [User, Insight], // <-- include all related entities here
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});
