import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.headers);
      const token = req.headers['authorization'].replace('Bearer ', '');
      const payload = this.jwtService.verify(token);

      if (typeof payload === 'object' && payload.hasOwnProperty('id')) {
        console.log(payload['id']);
        const { user } = await this.usersService.getUserById(payload['id']);
        req['user'] = user;
      }
    } catch (error) {}

    next();
  }
}
