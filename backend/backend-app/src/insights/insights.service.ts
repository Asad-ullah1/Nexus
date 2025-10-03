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
    private readonly insightRepository: Repository<Insight>,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: number, createDto: CreateInsightDto): Promise<Insight> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const insight = this.insightRepository.create({
      ...createDto,
      user, // ✅ Changed from 'author' to 'user'
    });
    return this.insightRepository.save(insight);
  }

  async findAll(search?: string, tag?: string): Promise<Insight[]> {
    const qb = this.insightRepository
      .createQueryBuilder('insight')
      .leftJoinAndSelect('insight.user', 'user'); // ✅ Changed from 'author' to 'user'

    if (search) {
      qb.andWhere(
        '(insight.title ILIKE :search OR insight.content ILIKE :search)', // ✅ Changed from 'summary' to 'content'
        { search: `%${search}%` },
      );
    }

    if (tag) {
      qb.andWhere(':tag = ANY(insight.tags)', { tag });
    }

    return qb.getMany();
  }

  async findOne(id: number): Promise<Insight> {
    const insight = await this.insightRepository.findOne({
      where: { id },
      relations: ['user'], // ✅ Changed from 'author' to 'user'
    });
    if (!insight) {
      throw new NotFoundException(`Insight with ID ${id} not found`);
    }
    return insight;
  }

  async update(
    id: number,
    userId: number,
    updateDto: UpdateInsightDto,
  ): Promise<Insight> {
    const insight = await this.findOne(id);

    if (!insight.user || insight.user.id !== userId) {
      // ✅ Changed from 'author' to 'user'
      throw new NotFoundException('Insight not found for this user');
    }

    Object.assign(insight, updateDto);
    return this.insightRepository.save(insight);
  }

  async updateInsight(
    id: number,
    userId: number,
    text: string,
  ): Promise<Insight> {
    const insight = await this.findOne(id);

    if (!insight.user || insight.user.id !== userId) {
      // ✅ Changed from 'author' to 'user'
      throw new NotFoundException('Insight not found for this user');
    }

    insight.content = text; // ✅ Changed from 'summary' to 'content'

    return this.insightRepository.save(insight);
  }

  async remove(id: number, userId: number): Promise<{ message: string }> {
    const insight = await this.findOne(id);

    if (!insight.user || insight.user.id !== userId) {
      // ✅ Changed from 'author' to 'user'
      throw new NotFoundException('Insight not found for this user');
    }

    await this.insightRepository.remove(insight);
    return { message: 'Insight deleted successfully' };
  }
}
