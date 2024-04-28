import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'src/entities/room.entity';
import { Topic } from 'src/entities/topic.entity';
import { Vote } from 'src/entities/vote.entity';

import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';

@Module({
  imports: [TypeOrmModule.forFeature([Topic, Room, Vote])],
  controllers: [TopicsController],
  providers: [TopicsService],
})
export class TopicsModule {}
