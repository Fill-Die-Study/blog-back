import { PartialType } from '@nestjs/mapped-types';
import { Post } from '../entities/post.entity';

export class CreatePostDto extends PartialType(Post) {}
