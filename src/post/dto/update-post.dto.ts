import { PickType } from '@nestjs/swagger';
import { Post } from '../entities/post.entity';

export class UpdatePostDto extends PickType(Post, [
  'id',
  'content',
  'title',
  'user',
]) {}
