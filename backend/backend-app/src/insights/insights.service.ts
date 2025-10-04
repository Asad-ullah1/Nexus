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
      user,
    });
    return this.insightRepository.save(insight);
  }

  async findAll(search?: string, tag?: string): Promise<Insight[]> {
    const qb = this.insightRepository
      .createQueryBuilder('insight')
      .leftJoinAndSelect('insight.user', 'user');

    // ✅ CHANGE: support searching in both title & summary
    if (search) {
      qb.andWhere(
        '(insight.title ILIKE :search OR insight.summary ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // ✅ CHANGE: filter by a single tag inside tags array
    if (tag) {
      qb.andWhere(':tag = ANY(insight.tags)', { tag });
    }

    // 🔥 OPTIONAL NEXT: if you later want multiple tags (?tags=AI,philosophy)
    // qb.andWhere('insight.tags && :tags', { tags: tagsArray });

    return qb.getMany();
  }

  async findOne(id: number): Promise<Insight> {
    const insight = await this.insightRepository.findOne({
      where: { id },
      relations: ['user'],
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

    // ✅ CHANGE: better error (403 instead of 404 for unauthorized update)
    if (insight.userId !== userId) {
      throw new NotFoundException('Insight not found for this user');
      // 👉 later you can replace with ForbiddenException for cleaner auth
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

    // Check if user owns the insight
    if (insight.userId !== userId) {
      throw new NotFoundException('Insight not found for this user');
    }

    // Update the summary/text field
    insight.summary = text;

    // Save and return the updated insight
    return this.insightRepository.save(insight);
  }

  async remove(id: number, userId: number): Promise<{ message: string }> {
    const insight = await this.findOne(id);

    // ✅ same note here: consider ForbiddenException later
    if (insight.userId !== userId) {
      throw new NotFoundException('Insight not found for this user');
    }

    await this.insightRepository.remove(insight);
    return { message: 'Insight deleted successfully' };
  }
}
