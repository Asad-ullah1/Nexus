import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { InsightsModule } from './insights/insights.module';
import { User } from './users/user.entity';

@Module({
  imports: [
    // ✅ Global .env configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // ✅ Database connection setup with environment safety
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        autoLoadEntities: true,
        // 🔹 Synchronize only in development; disable in production
        synchronize: process.env.NODE_ENV !== 'production',
        logging: ['error', 'warn'],
        ssl:
          process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false } // Enable SSL on Render Postgres
            : false, // Disable SSL locally
      }),
    }),

    // ✅ Load entities for injection
    TypeOrmModule.forFeature([User]),
    AuthModule,
    UsersModule,
    InsightsModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  constructor() {
    console.log('🟢 AppModule initialized');
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    console.log(
      '🔹 Synchronize enabled:',
      process.env.NODE_ENV !== 'production',
    );
  }
}
