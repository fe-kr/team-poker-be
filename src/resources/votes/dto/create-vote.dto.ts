import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateVoteDto {
  @ApiProperty()
  @IsString()
  id?: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  topicId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  vote: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  userName: string;
}
