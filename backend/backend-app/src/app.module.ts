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
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'admin123',
      database: process.env.DATABASE_NAME || 'nexusdb',
      autoLoadEntities: true,
      synchronize: false, // Disable auto-sync to prevent schema conflicts
      logging: ['error', 'warn'], // Enable logging to see issues
      ssl: false,
      retryAttempts: 3,
      retryDelay: 3000,
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
    console.log('Host:', process.env.DATABASE_HOST);
    console.log('Port:', process.env.DATABASE_PORT);
    console.log('User:', process.env.DATABASE_USER);
    console.log('Database:', process.env.DATABASE_NAME);
  }
}
