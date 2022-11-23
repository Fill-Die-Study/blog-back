import { PickType } from '@nestjs/mapped-types';
import { Post } from '../entities/post.entity';

export class UpdatePostDto extends PickType(Post, [
  'id',
  'content',
  'title',
  'user',
]) {}
