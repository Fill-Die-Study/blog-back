import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { Post } from '../entities/post.entity';

export class UpdatePostDto extends PickType(Post, [
  'title',
  'content',
  'thumbnailUrl',
  'description',
  'isPrivate',
  'postUrl',
]) {
  @ApiProperty({ example: ['tag1', 'tag2'], nullable: true })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tagNames?: string[];
}
