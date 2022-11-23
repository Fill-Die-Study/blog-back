import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { CONFIG_OPTIONS } from './jwt.constants';
import { JwtModuleOptions } from './jwt.interfaces';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
  ) {}

  sign(payload: object) {
    return jwt.sign(payload, this.options.privateKey, {
      expiresIn: this.options.expires_in || '60s',
    });
  }

  verify(token: string) {
    return jwt.verify(token, this.options.privateKey);
  }
}
