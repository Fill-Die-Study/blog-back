import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { PostService } from 'src/post/post.service';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { CommentOutput } from './dto/create-comment.dto';
import { HttpStatus } from '@nestjs/common/enums';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly postService: PostService,
  ) {}

  async getAllComments(): Promise<CommentOutput> {
    try {
      const comments = await this.commentRepository.find({ relations: { post: true } });
      return {
        statusCode: HttpStatus.OK,
        comments,
      };
    } catch (error) {
      throw error;
    }
  }

  async getCommentsByMe(user: User): Promise<CommentOutput> {
    try {
      const comments = await this.commentRepository.find({
        where: { author: { id: user.id } },
        relations: { post: true },
      });
      return {
        statusCode: HttpStatus.OK,
        comments,
      };
    } catch (error) {
      throw error;
    }
  }

  async createComment(postId: number, user: User, content: string): Promise<CommentOutput> {
    try {
      const { post } = await this.postService.getPostById(postId);
      if (!post) {
        throw new NotFoundException('게시글을 찾을 수 없습니다.');
      }
      const comment = this.commentRepository.create({ content, author: user, post });
      this.commentRepository.save(comment);
      return {
        statusCode: HttpStatus.OK,
        comment,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateComment(commentId: number, user: User, updateContent: string): Promise<CommentOutput> {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id: commentId },
        relations: { author: { id: true } },
      });

      if (comment.author.id !== user.id) {
        throw new ForbiddenException('권한이 없습니다.');
      }

      const newComment = this.commentRepository.create({ ...comment, content: updateContent });
      this.commentRepository.save(newComment);
      return {
        statusCode: HttpStatus.OK,
        comment: newComment,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteComment(commentId: number, user: User): Promise<CommentOutput> {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id: commentId },
        relations: { author: true },
      });

      if (!comment) {
        throw new NotFoundException('게시글을 찾을 수 없습니다');
      }

      if (comment.author.id !== user.id) {
        throw new ForbiddenException('권한이 없습니다.');
      }

      this.commentRepository.delete({ id: commentId });
      return {
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }
}
