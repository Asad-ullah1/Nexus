import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { InsightsModule } from './insights/insights.module';

@Module({
  imports: [
  ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', 'Setup.env'] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DATABASE_HOST'),
        port: parseInt(config.get<string>('DATABASE_PORT'), 10),
        username: config.get<string>('DATABASE_USER'),
        password: config.get<string>('DATABASE_PASSWORD'),
        database: config.get<string>('DATABASE_NAME'),
        autoLoadEntities: true,
  synchronize: true, // auto creates tables (good for dev)
  // NOTE: If in development, set "synchronize: true" to auto-create tables.
  // For production, use migrations instead of synchronize for schema changes.
      }),
    }),
  UsersModule,
  AuthModule,
  InsightsModule,
  ],
})
export class AppModule {}
