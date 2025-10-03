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
      },
    };
  }

  @Get('debug')
  async getDebugInfo(): Promise<object> {
    try {
      console.log('🔍 Debug endpoint called - checking database...');

      const userCount = await this.userRepository.count();
      console.log('👥 Total users in database:', userCount);

      const users = await this.userRepository.find({
        select: ['id', 'email', 'name', 'created_at'],
        order: { created_at: 'DESC' },
        take: 10, // Get last 10 users
      });

      console.log(
        '📋 Recent users:',
        users.map((u) => u.email),
      );

      return {
        status: 'Database connected',
        totalUsers: userCount,
        recentUsers: users.map((u) => ({
          id: u.id,
          email: u.email,
          name: u.name,
          created_at: u.created_at,
        })),
        databaseInfo: {
          timestamp: new Date().toISOString(),
          connected: true,
        },
      };
    } catch (error) {
      console.error('❌ Database debug error:', error.message);
      return {
        status: 'Database error',
        error: error.message,
        connected: false,
      };
    }
  }

  @Get('debug/clear-test-users')
  async clearTestUsers(): Promise<object> {
    try {
      // Remove test users (be careful with this!)
      const result = await this.userRepository.delete({
        email: { $like: '%@example.com' } as any,
      });

      return {
        message: 'Test users cleared',
        deletedCount: result.affected,
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }
}
