import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { PostModule } from 'src/post/post.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { PostService } from 'src/post/post.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), PostModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
