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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get('DATABASE_URL');

        console.log('🔍 DATABASE CONNECTION DEBUG:');
        console.log('DATABASE_URL exists:', !!databaseUrl);
        if (databaseUrl) {
          // Log only the host part for security
          const urlParts = databaseUrl.match(
            /postgresql:\/\/([^:]+):([^@]+)@([^\/]+)\/(.+)/,
          );
          if (urlParts) {
            console.log('Database host:', urlParts[3]);
            console.log('Database name:', urlParts[4]);
          }
        }

        if (databaseUrl) {
          console.log('✅ Using DATABASE_URL for connection');
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            ssl: {
              rejectUnauthorized: false,
            },
            logging: ['error', 'warn'], // Add database query logging
          };
        } else {
          console.log('⚠️ Using individual DB variables for connection');
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
    TypeOrmModule.forFeature([User]),
    AuthModule,
    UsersModule,
    InsightsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
