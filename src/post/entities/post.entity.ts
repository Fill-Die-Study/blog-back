import { IsBoolean, IsNumber, IsString, MaxLength, ValidateIf, IsOptional } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { User } from 'src/users/entities/user.entity';
import { Comment } from './comment.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import sanitize from 'sanitize-html';
import { Tag } from './tag.entity';
import { Optional } from '@nestjs/common';

@Entity()
@Unique(['postUrl'])
export class Post extends CommonEntity {
  @Column({ default: '' })
  @IsString()
  title: string;

  @Column({ type: 'text' })
  @IsString()
  content: string;

  @Column({ default: '' })
  @IsOptional()
  @IsString()
  thumbnailUrl: string;

  @Column({ default: '' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  description: string;

  @Column({ default: false, nullable: true })
  @IsOptional()
  @IsBoolean()
  isPrivate!: boolean;

  @Column({ default: 0 })
  @IsOptional()
  @IsNumber()
  likeCount: number;

  @Column({ default: '' })
  @IsOptional()
  @IsString()
  postUrl: string;

  @OneToMany(() => Comment, (comment) => comment.post, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @ManyToMany(() => Tag, (tag) => tag.posts)
  @JoinTable()
  tags: Tag[];

  // TODO: 중복되는 postUrl이 생길 시 예외처리
  @BeforeInsert()
  @BeforeUpdate()
  createPostUrl() {
    this.postUrl = `${this.user.id}/${this.postUrl || this.title}`;
  }

  @BeforeInsert()
  @BeforeUpdate()
  sanitizedHtml() {
    this.content = sanitize(this.content, {
      allowedTags: [...sanitize.defaults.allowedTags, 'img'],
    });
  }
}
