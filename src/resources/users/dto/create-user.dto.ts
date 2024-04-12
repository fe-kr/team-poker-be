import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { UserType } from 'src/enums';

export class CreateUserDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: true, enum: UserType })
  @IsEnum(UserType)
  type: UserType;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  roomId: string;
}
