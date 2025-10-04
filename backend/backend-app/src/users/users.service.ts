import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Create a new user with hashed password
  async create(createUserDto: CreateUserDto): Promise<User> {
    console.log('🔍 Creating user with correct mapping:', {
      email: createUserDto.email,
      name: createUserDto.name,
      passwordProvided: !!createUserDto.password,
    });

    // ✅ CORRECT field mapping
    const newUser = this.usersRepository.create({
      email: createUserDto.email, // ✅ Email → email field
      password: createUserDto.password, // ✅ Password (already hashed) → password field
      name: createUserDto.name, // ✅ Name → name field
      role: 'user', // ✅ Default role
    });

    const savedUser = await this.usersRepository.save(newUser);

    console.log('✅ User saved correctly:', {
      id: savedUser.id,
      email: savedUser.email,
      name: savedUser.name,
    });

    return savedUser;
  }

  // Find one user by email (without password)
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  // Find one user by email and include password (for login)
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'name', 'role'],
    });
  }

  // Get all users
  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'email', 'name', 'role', 'created_at'],
    });
  }
}
