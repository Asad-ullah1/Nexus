import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Insight } from './insight.entity';
import { CreateInsightDto } from './dto/create-insight.dto';
import { UpdateInsightDto } from './dto/update-insight.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class InsightsService {
  constructor(
    @InjectRepository(Insight)
    private insightsRepository: Repository<Insight>,
    private usersService: UsersService,
  ) {}

  async create(createInsightDto: any, userId: number) {
    // ✅ FIX: Use findOne method that exists
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const insight = this.insightsRepository.create({
      ...createInsightDto,
      user,
    });

    return this.insightsRepository.save(insight);
  }

  async findAll() {
    return this.insightsRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id: number) {
    return this.insightsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findByUser(userId: number) {
    return this.insightsRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }
}
