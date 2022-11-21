import { PickType } from '@nestjs/mapped-types';
import { CommonOutput } from 'src/common/dtos/commonOutput.dto';
import { User } from '../entities/user.entity';

export class LoginDto extends PickType(User, ['email', 'password']) {}

export class LoginOutput extends CommonOutput {
  token?: string;
}
