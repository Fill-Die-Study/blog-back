import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Post()
  createUser(
    @Body()
    { email, password, role }: CreateUserDto,
  ) {
    return this.usersService.createUser({
      email,
      password,
      role,
    });
  }

  @Post('/login')
  login(@Body() { email, password }: LoginDto) {
    return this.usersService.login({ email, password });
  }
}
