import { PickType } from '@nestjs/mapped-types';
import { CommonOutput } from 'src/common/dtos/commonOutput.dto';
import { User } from '../entities/user.entity';

export class CreateUserDto extends PickType(User, [
  'email',
  'password',
  'role',
]) {}

export class UserOutput extends CommonOutput {
  users?: User[];
  user?: User;
}
