import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'src/entities/room.entity';
import { Topic } from 'src/entities/topic.entity';
import { Vote } from 'src/entities/vote.entity';

import { RoomsController } from './rooms.controller';
import { RoomsGateway } from './rooms.gateway';
import { RoomsService } from './rooms.service';
import { VotesModule } from '../votes/votes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Topic, Vote]), VotesModule],
  controllers: [RoomsController],
  providers: [RoomsService, RoomsGateway],
  exports: [RoomsService],
})
export class RoomsModule {}
