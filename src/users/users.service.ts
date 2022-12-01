import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import { CreateUserDto, UserOutput } from './dto/create-user.dto';
import { LoginDto, LoginOutput } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async getAllUsers(): Promise<UserOutput> {
    try {
      const users = await this.userRepository.find();
      return { statusCode: HttpStatus.OK, users };
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: number): Promise<UserOutput> {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) throw new NotFoundException();

      return { statusCode: HttpStatus.OK, user };
    } catch (error) {
      throw error;
    }
  }

  async createUser({ email, password, role }: CreateUserDto): Promise<UserOutput> {
    try {
      const user = await this.userRepository.findOneBy({ email });

      if (user) throw new ConflictException();

      const newUser = this.userRepository.create({
        email,
        password,
        role,
      });

      await this.userRepository.save(newUser);
      return { statusCode: HttpStatus.CREATED };
    } catch (error) {
      throw error;
    }
  }

  async updateUser(userInfo: User, updateUserDto: UpdateUserDto): Promise<UserOutput> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: userInfo.id,
        },
      });
      if (!user) throw new NotFoundException();

      const newUser = { ...user, ...updateUserDto };

      await this.userRepository.save(newUser);

      return { statusCode: HttpStatus.OK };
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(email: string): Promise<UserOutput> {
    try {
      await this.userRepository.delete({ email });
      return { statusCode: HttpStatus.OK };
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password }: LoginDto): Promise<LoginOutput> {
    try {
      const user = await this.userRepository.findOneBy({ email });
      if (!user) throw new BadRequestException('Email을 정확히 입력해주세요.');

      // TODO: Auth로 이동
      const isValidate = await user.comparePassword(password);
      if (!isValidate) throw new BadRequestException('비밀번호가 올바르지 않습니다.');

      const token = this.jwtService.sign({ id: user.id });
      return {
        statusCode: HttpStatus.OK,
        token,
      };
    } catch (error) {
      throw error;
    }
  }
}
