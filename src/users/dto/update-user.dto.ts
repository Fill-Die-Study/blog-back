import { OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { User } from '../entities/user.entity';

export class UpdateUserDto extends OmitType(PartialType(User), ['id']) {}
