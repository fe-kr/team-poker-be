import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CreateVoteDto } from './dto/create-vote.dto';
import { VotesService } from './votes.service';
import { JwtAuthGuard } from '../auth/auth.guard';

@ApiTags('Votes')
@ApiBearerAuth('JWT')
@Controller('votes')
export class VotesController {
  constructor(private votesService: VotesService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':topicId')
  findVotesByTopicId(@Param('topicId') topicId: string) {
    return this.votesService.findVotesByTopicId(topicId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createVote(@Body() voteDto: CreateVoteDto) {
    return this.votesService.createVote(voteDto);
  }
}
