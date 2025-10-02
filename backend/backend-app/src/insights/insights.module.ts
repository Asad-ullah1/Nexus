import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Insight } from './insight.entity';

import { InsightsService } from './insights.service';
import { InsightsController } from './insights.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Insight]), UsersModule],
  providers: [InsightsService],
  controllers: [InsightsController],
})
export class InsightsModule {}
