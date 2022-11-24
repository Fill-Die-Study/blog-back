import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UserOutput } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';
import { User } from './entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';

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

  @Get('/profile')
  @UseGuards(AuthGuard)
  profile(@Req() req: Request): UserOutput {
    return { success: true, user: req.user as User };
  }

  @Patch('/profile')
  @UseGuards(AuthGuard)
  editProfile(
    @Req() req: Request,
    @Body() body: UpdateUserDto,
  ): Promise<UserOutput> {
    const { id } = req.user as User;
    return this.usersService.updateUser(id, body);
  }
}
