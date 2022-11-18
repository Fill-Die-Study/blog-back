import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(id: string, pass: string) {
    const user = await this.usersService.findOneById(id);
    if (user && user.password === pass) {
      const { password, ...userData } = user;
      return userData;
    }

    return null;
  }

  async login(user: User) {
    const { password, ...userData } = user;
    return {
      access_token: this.jwtService.sign(userData),
    };
  }
}
