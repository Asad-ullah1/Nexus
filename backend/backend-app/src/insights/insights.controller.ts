import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Put, // ⭐ Add Put decorator
  Query,
  UseGuards,
  Req, // ⭐ Needed to read user from JWT
} from '@nestjs/common';
import { InsightsService } from './insights.service';
import { CreateInsightDto } from './dto/create-insight.dto';
import { UpdateInsightDto } from './dto/update-insight.dto';
import { AuthGuard } from '@nestjs/passport'; // ⭐ Import AuthGuard for JWT protection

@Controller('insights')
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  // ⭐ Protect Create with JWT
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Req() req, // ⭐ req.user will contain { userId, email } from JWT
    @Body() createDto: CreateInsightDto,
  ) {
    // ⭐ Pass logged-in userId automatically
    return this.insightsService.create(req.user.userId, createDto);
  }

  // ⭐ Public route → no guard
  @Get()
  findAll(@Query('search') search?: string, @Query('tag') tag?: string) {
    return this.insightsService.findAll(search, tag);
  }

  // ⭐ Public route → no guard
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.insightsService.findOne(+id);
  }

  // ⭐ Protect Update with JWT
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req, // ⭐ Use logged-in userId instead of body/params
    @Body() updateDto: UpdateInsightDto,
  ) {
    return this.insightsService.update(+id, req.user.userId, updateDto);
  }

  // ⭐ PUT endpoint - functionally identical to PATCH but follows REST conventions
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  updatePut(
    @Param('id') id: string,
    @Req() req, // ⭐ Use logged-in userId from JWT
    @Body() updateDto: UpdateInsightDto,
  ) {
    return this.insightsService.update(+id, req.user.userId, updateDto);
  }

  // ⭐ PUT endpoint specifically for updating insight text/summary
  @UseGuards(AuthGuard('jwt'))
  @Put(':id/text')
  updateInsightText(
    @Param('id') id: string,
    @Req() req, // ⭐ Use logged-in userId from JWT
    @Body() body: { text: string },
  ) {
    return this.insightsService.updateInsight(+id, req.user.userId, body.text);
  }

  // ⭐ Protect Delete with JWT
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.insightsService.remove(+id, req.user.userId);
  }
}
