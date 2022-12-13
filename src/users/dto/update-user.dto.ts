import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { User } from '../entities/user.entity';

export class UpdateUserDto extends OmitType(PartialType(User), ['id']) {
  @ApiProperty({ example: 'test1234', required: true })
  @IsString()
  password: string;
}
