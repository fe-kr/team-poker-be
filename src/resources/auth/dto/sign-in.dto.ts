import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ROOM_PASSWORD_VALIDATION_REGEX } from 'src/constants/regexp';

export class SignInDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  userName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @Matches(ROOM_PASSWORD_VALIDATION_REGEX, {
    message: 'Password should contain at least 8 letters and digits',
  })
  password: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  roomId: string;
}
