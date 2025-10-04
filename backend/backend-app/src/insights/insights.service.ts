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

  async create(userId: number, createInsightDto: CreateInsightDto) {
    // ✅ FIX: Use findOne method that exists
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const insight = this.insightsRepository.create({
      ...createInsightDto,
      user,
    });

    return this.insightsRepository.save(insight);
  }

  async findAll(search?: string, tag?: string) {
    const queryBuilder = this.insightsRepository
      .createQueryBuilder('insight')
      .leftJoinAndSelect('insight.user', 'user');

    if (search) {
      queryBuilder.andWhere(
        'insight.title ILIKE :search OR insight.content ILIKE :search',
        {
          search: `%${search}%`,
        },
      );
    }

    if (tag) {
      queryBuilder.andWhere('insight.tags ILIKE :tag', {
        tag: `%${tag}%`,
      });
    }

    return queryBuilder.getMany();
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

  async update(id: number, userId: number, updateInsightDto: UpdateInsightDto) {
    const insight = await this.insightsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!insight) {
      throw new NotFoundException('Insight not found');
    }

    if (insight.user.id !== userId) {
      throw new NotFoundException('Unauthorized to update this insight');
    }

    await this.insightsRepository.update(id, updateInsightDto);
    return this.findOne(id);
  }

  async updateInsight(id: number, userId: number, text: string) {
    const insight = await this.insightsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!insight) {
      throw new NotFoundException('Insight not found');
    }

    if (insight.user.id !== userId) {
      throw new NotFoundException('Unauthorized to update this insight');
    }

    await this.insightsRepository.update(id, { content: text });
    return this.findOne(id);
  }

  async remove(id: number, userId: number) {
    const insight = await this.insightsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!insight) {
      throw new NotFoundException('Insight not found');
    }

    if (insight.user.id !== userId) {
      throw new NotFoundException('Unauthorized to delete this insight');
    }

    await this.insightsRepository.remove(insight);
    return { message: 'Insight deleted successfully' };
  }
}
