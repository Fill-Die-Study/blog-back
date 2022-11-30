import { OmitType, PickType } from '@nestjs/swagger';
import { Post } from '../entities/post.entity';

export class UpdatePostDto extends OmitType(Post, [
  'createAt',
  'deleteAt',
  'updateAt',
  'user',
  'comments',
  'likeCount',
  'postUrl',
]) {}
