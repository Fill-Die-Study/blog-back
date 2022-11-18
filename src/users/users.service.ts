import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOneByUUID(id: string) {
    return this.userRepository.findOneBy({ userId: id });
  }

  findOneById(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update({ userId: id }, updateUserDto);
  }

  remove(id: string) {
    return this.userRepository.delete({ userId: id });
  }
}
