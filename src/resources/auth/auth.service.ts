import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { UserType } from 'src/constants/enum';

import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { RoomsService } from '../rooms/rooms.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private roomsService: RoomsService,
    private usersService: UsersService,
  ) {}

  async signUp(signUpParams: SignUpDto): Promise<string> {
    const { password, userName } = signUpParams;

    const hashedPassword = await hash(password, 10);

    const room = await this.roomsService.createRoom({
      password: hashedPassword,
    });

    const user = await this.usersService.createUser({
      type: UserType.ADMIN,
      name: userName,
      roomId: room.id,
    });

    return this.jwtService.signAsync({ ...user });
  }

  async signIn(signInParams: SignInDto): Promise<string> {
    const { password, roomId, userName } = signInParams;

    const room = await this.roomsService.findRoomById(roomId, true);

    if (!room) throw new ForbiddenException('Access Denied');

    const passwordMatches = await compare(password, room.password);

    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    let [user] = await this.usersService.findUsers(roomId, userName);

    if (!user) {
      user = await this.usersService.createUser({
        type: UserType.USER,
        name: userName,
        roomId: room.id,
      });
    }

    return this.jwtService.signAsync({ ...user });
  }
}
