import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users/user.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Get()
  getHealth(): object {
    return {
      status: 'OK',
      message: '🚀 Nexus Backend API is running!',
      timestamp: new Date().toISOString(),
      endpoints: {
        signup: 'POST /auth/signup',
        login: 'POST /auth/login',
        debug: 'GET /debug',
        cleanup: 'GET /debug/cleanup',
      },
    };
  }

  @Get('debug')
  async getDebugInfo(): Promise<object> {
    try {
      const userCount = await this.userRepository.count();
      const users = await this.userRepository.find({
        select: ['id', 'email', 'name', 'created_at'],
        order: { created_at: 'DESC' },
        take: 10,
      });

      return {
        status: 'Database connected',
        totalUsers: userCount,
        users: users,
        databaseInfo: {
          timestamp: new Date().toISOString(),
          connected: true,
        },
      };
    } catch (error) {
      return {
        status: 'Database error',
        error: error.message,
        connected: false,
      };
    }
  }

  @Get('debug/cleanup')
  async cleanupCorruptedData(): Promise<object> {
    try {
      // Remove users where email field contains "password123" (corrupted data)
      const corruptedUsers = await this.userRepository.find({
        where: { email: 'password123' },
      });

      console.log('🧹 Found corrupted users:', corruptedUsers.length);

      if (corruptedUsers.length > 0) {
        const result = await this.userRepository.remove(corruptedUsers);
        console.log('🗑️ Removed corrupted users:', result.length);

        return {
          message: 'Cleaned up corrupted user data',
          removedUsers: result.length,
          details: 'Removed users with email="password123"',
        };
      } else {
        return {
          message: 'No corrupted data found',
          removedUsers: 0,
        };
      }
    } catch (error) {
      return {
        error: error.message,
        message: 'Cleanup failed',
      };
    }
  }
}
