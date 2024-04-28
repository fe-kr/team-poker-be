import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import type { Topic } from './topic.entity';

@Entity()
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne('Topic', 'votes', {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  topic: Topic;

  @Column()
  topicId: string;

  @Column()
  vote: number;

  @Column()
  userName: string;
}
