import { IsBoolean, IsNumber, IsString, MaxLength } from 'class-validator';
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

@Entity()
@Unique(['postUrl'])
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

  @Column({ default: '' })
  @IsString()
  postUrl: string;

  // TODO: 중복되는 postUrl이 생길 시 예외처리
  @BeforeInsert()
  @BeforeUpdate()
  createPostUrl() {
    this.postUrl =
      this.postUrl || `${this.user.id}/${this.postUrl || this.title}`;
  }

  @BeforeInsert()
  @BeforeUpdate()
  sanitizedHtml() {
    this.content = sanitize(this.content, {
      allowedTags: [...sanitize.defaults.allowedTags, 'img'],
    });
  }
}
