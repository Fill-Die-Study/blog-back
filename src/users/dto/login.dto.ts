import { PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/commonOutput.dto';
import { User } from '../entities/user.entity';

export class LoginDto extends PickType(User, ['email']) {
  @IsString()
  password: string;
}

export class LoginOutput extends CommonOutput {
  token?: string;
}
