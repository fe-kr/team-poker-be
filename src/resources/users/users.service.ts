import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  findUsers(roomId: string, name?: string) {
    return this.usersRepository.findBy({ roomId, name });
  }

  createUser(userParams: CreateUserDto) {
    const newUser = this.usersRepository.create(userParams);

    return this.usersRepository.save(newUser);
  }

  async updateUser(id: string, userParams: UpdateUserDto) {
    await this.usersRepository.update({ id }, userParams);

    return this.usersRepository.findOneBy({ id });
  }

  deleteUser(id: string) {
    return this.usersRepository.delete({ id });
  }
}
