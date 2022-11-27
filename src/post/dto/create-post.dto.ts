import { PickType } from '@nestjs/mapped-types';
import { CommonOutput } from 'src/common/dtos/commonOutput.dto';
import { Post } from '../entities/post.entity';

export class CreatePostDto extends PickType(Post, [
  'title',
  'content',
  'user',
  // 'postUrl',
  // 'isPrivate',
  // 'description',
]) {}

export class PostOutput extends CommonOutput {
  posts?: Post[];
  post?: Post;
}
