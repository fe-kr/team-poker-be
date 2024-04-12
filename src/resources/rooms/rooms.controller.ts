import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CreateRoomDto } from './dto/create-room.dto';
import { RoomsService } from './rooms.service';
import { JwtAuthGuard } from '../auth/auth.guard';

@ApiTags('Rooms')
@ApiBearerAuth('JWT')
@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getRoomById(@Param('id') id: string) {
    return this.roomsService.findRoomById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createRoom(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.createRoom(createRoomDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteRoomById(@Param('id') id: string) {
    await this.roomsService.deleteRoom(id);
  }
}
