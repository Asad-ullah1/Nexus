import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  ConflictException,
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

  async signup(email: string, password: string, name: string) {
    console.log('🔍 Signup attempt:', { email, name });

    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(email);
    console.log(
      '🔍 Existing user check:',
      existingUser ? 'User exists' : 'User not found',
    );

    if (existingUser) {
      console.log('❌ User already exists with email:', email);
      throw new ConflictException('User with this email already exists');
    }

    if (!password) {
      throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
    }
    // ✅ Always hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      name,
      email,
      password: hashedPassword,
    });
    // Remove password from response
    const { password: _, ...result } = user;
    return { message: 'User created successfully', user: result };
  }

  async validateUser(email: string, password: string) {
    // Fetch user including password
    const user = await this.usersService.findByEmailWithPassword(email);

    if (!user) {
      console.log(`❌ User not found for email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare plaintext password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log('Login debug:', {
      email,
      plainPassword: password,
      dbHashedPassword: user.password,
      isPasswordValid,
    });

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Return user without password
    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
