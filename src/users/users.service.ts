import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserParams, UpdateUserParams } from './types';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  findUsers(roomId: string) {
    return this.usersRepository.findBy({ roomId });
  }

  createUser(userParams: CreateUserParams) {
    const newUser = this.usersRepository.create(userParams);
    return this.usersRepository.save(newUser);
  }

  updateUser(id: string, userParams: UpdateUserParams) {
    return this.usersRepository.update({ id }, userParams);
  }

  deleteUser(id: string) {
    return this.usersRepository.delete({ id });
  }
}
