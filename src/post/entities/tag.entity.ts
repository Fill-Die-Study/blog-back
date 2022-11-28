import { IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  Unique,
} from 'typeorm';
import { Post } from './post.entity';

@Entity()
@Unique(['name'])
export class Tag extends CommonEntity {
  @Column()
  @IsString()
  name: string;

  @ManyToMany(() => Post, (post) => post.tags)
  posts: Post[];
}
