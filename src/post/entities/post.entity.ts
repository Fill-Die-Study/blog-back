import { IsBoolean, IsNumber, IsString, MaxLength, ValidateIf, IsOptional } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { User } from 'src/users/entities/user.entity';
import { Comment } from '../../comment/entities/comment.entity';
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
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Unique(['postUrl'])
export class Post extends CommonEntity {
  @ApiProperty({ example: '게시글 이름이름이름이름이름', required: true })
  @Column({ default: '' })
  @IsString()
  title: string;

  @ApiProperty({ example: '<p>나랏말싸미... <span>엄....</span></p>', required: true })
  @Column({ type: 'text' })
  @IsString()
  content: string;

  @ApiProperty({ example: 'https://cdn.blogback.com/path/imgename.png', default: '' })
  @Column({ default: '' })
  @IsOptional()
  @IsString()
  thumbnailUrl: string;

  @ApiProperty({ example: '게시글 설명' })
  @Column({ default: '' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  description: string;

  @ApiProperty({ example: false, default: false })
  @Column({ default: false, nullable: true })
  @IsOptional()
  @IsBoolean()
  isPrivate!: boolean;

  @ApiProperty({ example: 0, default: 0 })
  @Column({ default: 0 })
  @IsOptional()
  @IsNumber()
  likeCount: number;

  @ApiProperty({ example: '/my-custom-url', default: '' })
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
