import { InternalServerErrorException } from '@nestjs/common';
import { IsBoolean, IsNumber, IsString, MaxLength } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import sanitize from 'sanitize-html';

@Entity()
export class Post extends CommonEntity {
  @Column({ default: '' })
  @IsString()
  title: string;

  @Column({ default: '' })
  @IsString()
  thumbnailUrl: string;

  @Column({ default: '' })
  @IsString()
  @MaxLength(150)
  description: string;

  @Column({ type: 'text' })
  @IsString()
  content: string;

  @Column({ default: false })
  @IsBoolean()
  isPrivate: boolean;

  @Column({ default: 0 })
  @IsNumber()
  likeCount: number;

  // @ManyToMany(() => Tag)
  // @JoinTable

  // @OneToMany(() => Comment, (comment) => comment.post)
  // comments: Comment[]

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @Column({ default: '' })
  @IsString()
  postUrl: string;

  @BeforeInsert()
  createPostUrl() {
    this.postUrl = `${this.user.id}/${this.postUrl || this.title}`;
  }

  @BeforeInsert()
  sanitizedHtml() {
    this.content = sanitize(this.content, {
      allowedTags: [...sanitize.defaults.allowedTags, 'img'],
    });
  }
  // TODO: content html script 필터링 기능
}
