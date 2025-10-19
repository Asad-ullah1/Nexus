import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
      throw new BadRequestException('Signup failed. Please try again.');
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
        throw new BadRequestException('Invalid credentials');
      }

      return this.authService.login(user);
    } catch (error) {
      console.error('Login controller error:', error);
      throw new BadRequestException('Login failed. Please try again.');
    }
  }
}
