import { InternalServerErrorException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';

enum UserRole {
  USER,
  ADMIN,
}

@Entity('user')
export class User extends CommonEntity {
  @Column()
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: true,
    default: UserRole.USER,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @BeforeInsert()
  async hashPassword() {
    try {
      this.password = await hash(this.password, 10);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  comparePassword(inputPass: string) {
    return compare(inputPass, this.password);
  }
}
