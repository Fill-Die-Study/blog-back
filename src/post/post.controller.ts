import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { Public } from 'src/auth/auth.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreatePostDto, PostOutput } from './dto/create-post.dto';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Public()
  @Get()
  getAllPost() {
    return this.postService.getAllPost();
  }

  @Public()
  @Get('/:id')
  getPostById(@Param('id') id: number): Promise<PostOutput> {
    return this.postService.getPostById(id);
  }

  @Get('/me')
  async getAllMyPost(@Req() req: Request): Promise<PostOutput> {
    const user = req.user as User;
    return this.postService.getAllMyPost(user.id);
  }

  @Post()
  createPost(@Body() createPostBody: CreatePostDto, @Req() req: Request) {
    return this.postService.createPost(createPostBody, req.user as User);
  }

  @Patch('/:id')
  async updatePost(
    @Param('id') id: number,
    @Body() { title, content }: CreatePostDto,
    @Req() req: Request,
  ): Promise<PostOutput> {
    const { post } = await this.postService.getPostById(id);
    const user = req.user as User;
    if (!success) {
      return {
        success,
        error: '게시글을 찾을 수 없습니다.',
      };
    }

    if (post.user.id !== user.id) {
      return {
        success: false,
        error: '권한이 없습니다.',
      };
    }

    return this.postService.updatePost({
      id,
      user,
      title,
      content,
    });
  }

  @Delete('/:id')
  async deletePost(@Param('id') id: number, @Req() req: Request) {
    const { success, post } = await this.postService.getPostById(id);
    const user = req.user as User;
    if (!success) {
      return {
        success,
        error: '게시글을 찾을 수 없습니다.',
      };
    }

    if (post.user.id !== user.id) {
      return {
        success,
        error: '권한이 없습니다.',
      };
    }

    return this.postService.deletePost(id);
  }
}
