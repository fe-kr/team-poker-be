import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vote } from 'src/entities/vote.entity';
import { Repository } from 'typeorm';

import { CreateVoteDto } from './dto/create-vote.dto';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote) private votesRepository: Repository<Vote>,
  ) {}

  findVotesByTopicId(topicId: string) {
    return this.votesRepository.findBy({ topicId });
  }

  createVote(voteParams: CreateVoteDto) {
    const newVote = this.votesRepository.create(voteParams);

    return this.votesRepository.save(newVote);
  }

  deleteVotesByTopicId(topicId: string) {
    return this.votesRepository.delete({ topicId });
  }

  async calculateVotesResult(topicId: string) {
    const votes = await this.findVotesByTopicId(topicId);
    const results = votes.map(({ vote }) => vote).sort((a, b) => a - b);
    const middleIndex = Math.floor(results.length / 2);
    const votesSum = results.reduce((acc, vote) => (acc += vote), 0);
    const votesMean = votesSum / results.length;
    const votesMedian =
      results.length % 2
        ? results[middleIndex]
        : 0.5 * (results[middleIndex - 1] + results[middleIndex]) || 0;

    return {
      min: Math.min(...results).toFixed(2),
      max: Math.max(...results).toFixed(2),
      mean: votesMean.toFixed(2),
      median: votesMedian.toFixed(2),
    };
  }
}
