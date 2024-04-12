import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateRoomDto } from './dto/create-room.dto';
import { RoomsService } from './rooms.service';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Get(':id')
  getRoomById(@Param('id') id: string) {
    return this.roomsService.findRoomById(id);
  }

  @Post()
  createRoom(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.createRoom(createRoomDto);
  }

  @Delete(':id')
  async deleteRoomById(@Param('id') id: string) {
    await this.roomsService.deleteRoom(id);
  }
}
