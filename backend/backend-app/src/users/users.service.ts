import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Get all users
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  // Create a new user with hashed password
  async create(userData: Partial<User>): Promise<User> {
    let password = userData.password;
    // Only hash if not already hashed
    if (!password.startsWith('$2b$')) {
      password = await bcrypt.hash(password, 10);
    }
    const newUser = this.usersRepository.create({
      ...userData,
      password,
    });
    return this.usersRepository.save(newUser);
  }

  // Find one user by email (without password)
  async findByEmail(email: string): Promise<User | undefined> {
    try {
      return await this.usersRepository.findOne({ where: { email } });
    } catch (error) {
      console.error('Error finding user by email:', error);
      return undefined;
    }
  }

  // Find one user by email and include password (for login)
  async findByEmailWithPassword(email: string): Promise<User | undefined> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  // Update user without re-hashing password if not changed
  async update(id: number, updateData: Partial<User>): Promise<User> {
    if (updateData.password) {
      // Only hash if password is changed and not already hashed
      if (!updateData.password.startsWith('$2b$')) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }
    }
    await this.usersRepository.update(id, updateData);
    return this.usersRepository.findOne({ where: { id } });
  }

  // Find one user by id
  async findOne(id: number): Promise<User | undefined> {
    try {
      return await this.usersRepository.findOne({ where: { id } });
    } catch (error) {
      console.error('Error finding user by id:', error);
      return undefined;
    }
  }
}
