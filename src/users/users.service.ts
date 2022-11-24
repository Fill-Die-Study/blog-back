import { Injectable } from '@nestjs/common';
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
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async getAllUsers(): Promise<UserOutput> {
    try {
      const users = await this.userRepository.find();
      return { success: true, users };
    } catch (error) {
      return { success: false, error };
    }
  }

  async getUserById(id: number): Promise<UserOutput> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      return { success: true, user };
    } catch (error) {
      return { success: false, error };
    }
  }

  async createUser({
    email,
    password,
    role,
  }: CreateUserDto): Promise<UserOutput> {
    try {
      const isUser = await this.userRepository.findOneBy({ email });
      if (isUser) {
        return {
          success: false,
          error: '이미 같은 이메일은 가진 사용자가 존재합니다.',
        };
      }

      const newUser = this.userRepository.create({
        email,
        password,
        role,
      });
      console.log(newUser);
      await this.userRepository.save(newUser);
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error };
    }
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserOutput> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        return { success: false, error: '유저를 찾을 수 없습니다.' };
      }

      await this.userRepository.save({
        ...user,
        ...updateUserDto,
      });

      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  async deleteUser(email: string): Promise<UserOutput> {
    try {
      this.userRepository.delete({ email });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  async login({ email, password }: LoginDto): Promise<LoginOutput> {
    try {
      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        return {
          success: false,
          error: 'Email을 정확히 입력해주세요.',
        };
      }

      // TODO: Auth로 이동
      const isValidate = await user.comparePassword(password);
      if (!isValidate) {
        return {
          success: false,
          error: '비밀번호가 올바르지 않습니다.',
        };
      }

      const token = this.jwtService.sign({ id: user.id });
      return {
        success: true,
        token,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }
}
