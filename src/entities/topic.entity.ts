import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import type { Vote } from './vote.entity';

@Entity()
export class Topic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @ManyToOne('Room', 'topics', {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roomId' })
  roomId: string;

  @Column()
  description: string;

  @Column()
  estimation?: number;

  @OneToMany('Vote', 'topicId')
  @JoinColumn()
  votes?: Vote[];
}
