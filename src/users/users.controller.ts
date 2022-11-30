import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Req,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UserOutput } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';
import { User } from './entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/auth/auth.decorator';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: '유저 전체 조회',
  })
  @ApiCreatedResponse({
    description: '성공여부',
    schema: {
      example: {
        users: [
          {
            id: 0,
            email: 'aa@aa.com',
            password: 'test',
            role: 0,
            posts: [],
            createAt: new Date(),
            deleteAt: new Date(),
            updateAt: new Date(),
          },
          {
            id: 1,
            email: 'bb@bb.com',
            password: 'test',
            role: 0,
            posts: [],
            createAt: new Date(),
            deleteAt: new Date(),
            updateAt: new Date(),
          },
        ],
      } as UserOutput,
    },
  })
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get('/profile')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '본인 프로필 조회',
  })
  @ApiCreatedResponse({
    description: '성공여부',
    schema: {
      example: {
        user: {
          id: 1,
          email: 'bb@bb.com',
          password: 'test',
          role: 0,
          posts: [],
          createAt: new Date(),
          deleteAt: new Date(),
          updateAt: new Date(),
        },
      },
    },
  })
  profile(@Req() req: Request): UserOutput {
    return { statusCode: HttpStatus.OK, user: req.user as User };
  }

  @Patch('/profile')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '본인 프로필 수정',
  })
  @ApiCreatedResponse({
    description: '성공여부',
    schema: {
      example: { success: true },
    },
  })
  editProfile(
    @Req() req: Request,
    @Body() body: UpdateUserDto,
  ): Promise<UserOutput> {
    const { id } = req.user as User;
    return this.usersService.updateUser(id, body);
  }

  @Public()
  @Get('/:id')
  @ApiOperation({ summary: '유저 선택 조회' })
  @ApiCreatedResponse({
    description: '성공여부',
    schema: {
      example: {
        user: {
          id: 0,
          email: 'aa@aa.com',
          password: 'test',
          role: 0,
          posts: [],
          createAt: new Date(),
          deleteAt: new Date(),
          updateAt: new Date(),
        },
      } as UserOutput,
    },
  })
  getUserById(@Param('id') id: number) {
    return this.usersService.getUserById(id);
  }

  @Public()
  @Post()
  @ApiOperation({
    summary: '유저 생성',
  })
  @ApiCreatedResponse({
    description: '성공여부',
    schema: {
      example: {
        user: {
          id: 0,
          email: 'aa@aa.com',
          password: 'test',
          role: 0,
          posts: [],
          createAt: new Date(),
          deleteAt: new Date(),
          updateAt: new Date(),
        },
      },
    },
  })
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

  @Public()
  @Post('/login')
  @ApiOperation({
    summary: '로그인',
  })
  @ApiCreatedResponse({
    description: '성공여부',
    schema: {
      example: { token: 'string' },
    },
  })
  login(@Body() { email, password }: LoginDto) {
    return this.usersService.login({ email, password });
  }
}
