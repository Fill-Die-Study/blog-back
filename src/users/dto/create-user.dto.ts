import { PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/commonOutput.dto';
import { User } from '../entities/user.entity';

export class CreateUserDto extends PickType(User, ['email', 'role']) {
  @IsString()
  password: string;
}

export class UserOutput extends CommonOutput {
  users?: User[];
  user?: User;
}
