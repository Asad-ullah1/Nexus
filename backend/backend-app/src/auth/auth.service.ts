import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // =============================
  // 🔐 USER SIGNUP
  // =============================
  async signup(email: string, password: string, name: string) {
    console.log('🔍 Signup attempt with correct parameters:', {
      email,
      name,
      passwordLength: password?.length,
    });

    try {
      // ✅ Check if user already exists
      const existingUser = await this.usersService.findByEmail(email);
      console.log(
        '👤 Existing user check:',
        existingUser ? 'User exists' : 'User not found',
      );

      if (existingUser) {
        console.log('❌ User already exists with email:', email);
        throw new ConflictException('User with this email already exists');
      }

      // ✅ Validate password
      if (!password || password.length < 6) {
        throw new BadRequestException('Password must be at least 6 characters');
      }

      // ✅ Hash password securely
      console.log('🔐 Hashing password...');
      const hashedPassword = await bcrypt.hash(password, 10);

      // ✅ Create user record
      console.log('🧩 Creating new user record...');
      const user = await this.usersService.create({
        email,
        password: hashedPassword,
        name,
      });

      // ✅ Generate JWT token
      const payload = { email: user.email, sub: user.id };
      const access_token = this.jwtService.sign(payload);

      // ✅ Remove password before returning
      const { password: _, ...result } = user;

      console.log('✅ Signup successful for:', user.email);
      return {
        message: 'User created successfully',
        user: result,
        access_token,
      };
    } catch (error) {
      console.error('❌ Signup error details:', error.message || error);
      throw new BadRequestException(
        error.message || 'Signup failed. Please try again.',
      );
    }
  }

  // =============================
  // 🔓 USER LOGIN
  // =============================
  async validateUser(email: string, password: string) {
    try {
      // ✅ Fetch user (including password)
      const user = await this.usersService.findByEmailWithPassword(email);

      if (!user) {
        console.log(`❌ User not found for email: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      // ✅ Validate password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('🔍 Login validation:', {
        email,
        passwordValid: isPasswordValid,
      });

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // ✅ Return user without password
      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      console.error('❌ Login validation error:', error.message || error);
      throw new UnauthorizedException(error.message || 'Login failed');
    }
  }

  // =============================
  // 🎫 GENERATE JWT TOKEN
  // =============================
  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);
    console.log('🎫 JWT issued for user:', user.email);
    return {
      access_token: token,
      user,
    };
  }
}

