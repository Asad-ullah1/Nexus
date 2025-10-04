import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  // ✅ Flexible findOne method - accepts userId (number) OR email (string)
  async findOne(identifier: number | string): Promise<User | null> {
    if (typeof identifier === 'number') {
      // Search by ID
      return this.usersRepository.findOne({
        where: { id: identifier },
      });
    } else if (typeof identifier === 'string') {
      // Search by email
      return this.usersRepository.findOne({
        where: { email: identifier },
      });
    }

    return null;
  }

  // Keep specific methods for auth service compatibility
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'name', 'role'],
    });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'email', 'name', 'role', 'created_at'],
    });
  }

  // ✅ Updated to use UpdateUserDto
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
