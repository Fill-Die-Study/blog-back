import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Post } from '../../post/entities/post.entity';

@Entity()
export class Comment extends CommonEntity {
  @ApiProperty({ example: '댓글 내용', required: true })
  @Column()
  @IsString()
  content: string;

  @ManyToOne(() => User, (user) => user.comments)
  author: User;

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;
}
