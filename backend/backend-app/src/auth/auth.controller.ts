import { Controller, Post, Body, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() signupDto: { email: string; password: string; name: string },
  ) {
    try {
      return await this.authService.signup(
        signupDto.email,
        signupDto.password,
        signupDto.name,
      );
    } catch (error) {
      console.error('Signup controller error:', error);
      throw error;
    }
  }

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    try {
      const user = await this.authService.validateUser(
        loginDto.email,
        loginDto.password,
      );
      if (!user) {
        throw new Error('Invalid credentials');
      }
      return this.authService.login(user);
    } catch (error) {
      console.error('Login controller error:', error);
      throw error;
    }
  }
}
