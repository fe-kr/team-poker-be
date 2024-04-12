import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Room } from 'src/entities/room.entity';

import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room) private roomsRepository: Repository<Room>,
  ) {}

  findRoomById(id: string) {
    return this.roomsRepository.findOneBy({ id });
  }

  createRoom(roomParams: CreateRoomDto) {
    const newRoom = this.roomsRepository.create(roomParams);

    return this.roomsRepository.save(newRoom);
  }

  deleteRoom(id: string) {
    return this.roomsRepository.delete({ id });
  }
}
