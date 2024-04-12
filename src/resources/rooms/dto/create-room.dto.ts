import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  password: string;
}
