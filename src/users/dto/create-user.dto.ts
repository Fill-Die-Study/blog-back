import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/commonOutput.dto';
import { User } from '../entities/user.entity';

export class CreateUserDto extends PickType(User, ['email', 'role']) {
  @ApiProperty({ example: 'test1234', required: true })
  @IsString()
  password: string;
}

export class UserOutput extends CommonOutput {
  users?: User[];
  user?: User;
}
