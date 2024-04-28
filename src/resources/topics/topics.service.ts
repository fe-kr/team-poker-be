import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Topic } from 'src/entities/topic.entity';
import { Repository } from 'typeorm';

import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic) private topicsRepository: Repository<Topic>,
  ) {}

  findTopics(roomId: string) {
    return this.topicsRepository.find({
      where: { roomId },
      relations: { votes: true },
    });
  }

  findTopicById(roomId: string, id: string) {
    return this.topicsRepository.findOne({
      where: { roomId, id },
      relations: { votes: true },
    });
  }

  createTopic(topicParams: CreateTopicDto) {
    const newTopic = this.topicsRepository.create(topicParams);

    return this.topicsRepository.save(newTopic);
  }

  async updateTopic(id: string, topicParams: UpdateTopicDto) {
    await this.topicsRepository.update({ id }, topicParams);

    return this.topicsRepository.findOneBy({ id });
  }

  deleteTopic(id: string) {
    return this.topicsRepository.delete({ id });
  }
}
