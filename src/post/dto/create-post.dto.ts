import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/commonOutput.dto';
import { Post } from '../entities/post.entity';

export class CreatePostDto extends OmitType(PartialType(Post), [
  'id',
  'createAt',
  'deleteAt',
  'updateAt',
  'user',
  'comments',
  'tags',
  'likeCount',
]) {
  @ApiProperty({ example: ['tag1', 'tag2'], nullable: true })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tagNames?: string[];
}

export class PostOutput extends CommonOutput {
  posts?: Post[];
  post?: Post;
}
