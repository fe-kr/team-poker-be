import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { TopicsService } from './topics.service';
import { JwtAuthGuard } from '../auth/auth.guard';

@ApiTags('Topics')
@ApiBearerAuth('JWT')
@Controller('topics')
export class TopicsController {
  constructor(private topicsService: TopicsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getTopicsByRoomId(@Query('roomId') roomId: string) {
    return this.topicsService.findTopics(roomId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':topicId')
  getTopicById(
    @Query('roomId') roomId: string,
    @Param('topicId') topicId: string,
  ) {
    return this.topicsService.findTopicById(roomId, topicId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createTopic(@Body() createTopicDto: CreateTopicDto) {
    return this.topicsService.createTopic(createTopicDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateTopicById(
    @Param('id') id: string,
    @Body() updateTopicDto: UpdateTopicDto,
  ) {
    return this.topicsService.updateTopic(id, updateTopicDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteTopicById(@Param('id') id: string) {
    await this.topicsService.deleteTopic(id);
  }
}
