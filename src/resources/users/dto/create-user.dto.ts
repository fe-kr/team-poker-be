import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserType } from 'src/constants/enum';
import { ValueOf } from 'src/types/common';

export class CreateUserDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: true, enum: UserType })
  type: ValueOf<typeof UserType>;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  roomId: string;
}
