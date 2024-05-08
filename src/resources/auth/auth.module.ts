import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthStrategy } from './auth.strategy';
import { RoomsModule } from '../rooms/rooms.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PassportModule, UsersModule, RoomsModule],
  controllers: [AuthController],
  providers: [AuthService, AuthStrategy],
  exports: [AuthService],
})
export class AuthModule {}
