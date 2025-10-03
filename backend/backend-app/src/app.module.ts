import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { InsightsModule } from './insights/insights.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get('DATABASE_URL');

        if (databaseUrl) {
          // Production: Use DATABASE_URL (Render format)
          console.log('Using DATABASE_URL for connection');
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            ssl: {
              rejectUnauthorized: false,
            },
          };
        } else {
          // Development: Use individual variables
          console.log('Using individual DB variables for connection');
          return {
            type: 'postgres',
            host: configService.get('DATABASE_HOST', 'localhost'),
            port: parseInt(configService.get('DATABASE_PORT', '5432')),
            username: configService.get('DATABASE_USER', 'postgres'),
            password: configService.get('DATABASE_PASSWORD'),
            database: configService.get('DATABASE_NAME', 'nexusdb'),
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
          };
        }
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    InsightsModule,
  ],
})
export class AppModule {}
