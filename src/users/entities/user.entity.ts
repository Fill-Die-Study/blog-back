import { InternalServerErrorException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { compare, hash } from 'bcrypt';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { Post } from '../../post/entities/post.entity';
import { Comment } from '../../post/entities/comment.entity';

enum UserRole {
  USER,
  ADMIN,
}

@Entity('user')
export class User extends CommonEntity {
  @ApiProperty({ example: 'test@test.com', required: true })
  @Column()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'test1234', required: true })
  @Column()
  @IsString()
  password: string;

  @ApiProperty({ example: 0, required: true })
  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: true,
    default: UserRole.USER,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.author, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  comments: Comment[];

  @BeforeInsert()
  @BeforeUpdate()
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
