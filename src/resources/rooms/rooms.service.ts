import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/entities/room.entity';
import { Repository } from 'typeorm';

import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room) private roomsRepository: Repository<Room>,
  ) {}

  findRoomById(id: string, includePassword?: boolean) {
    return this.roomsRepository.findOne({
      where: { id },
      relations: { topics: true },
      select: { id: !includePassword },
    });
  }

  createRoom(roomParams: CreateRoomDto) {
    const newRoom = this.roomsRepository.create(roomParams);

    return this.roomsRepository.save(newRoom);
  }

  deleteRoom(id: string) {
    return this.roomsRepository.delete({ id });
  }
}
