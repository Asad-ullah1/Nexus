import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { InsightsModule } from './insights/insights.module';
import { User } from './users/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // ✅ Database connection setup
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // Reads from .env
      autoLoadEntities: true, // Auto-detects all entities in project
      synchronize: true, // Auto-creates tables during development (disable in production)
      logging: ['error', 'warn'], // Logs errors/warnings
      ssl: false, // Disable SSL for local setup
      retryAttempts: 3, // Retries if DB not ready
      retryDelay: 3000, // Wait time between retries
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    UsersModule,
    InsightsModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  constructor() {
    console.log('🔍 LOCAL DATABASE CONNECTION DEBUG:');
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
  }
}
