import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/users/entities/user.entity';
import { CreatePostDto, PostOutput } from './dto/create-post.dto';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getAllPost() {
    return this.postService.getAllPost();
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  async getAllMyPost(@Req() req: Request): Promise<PostOutput> {
    const user = req.user as User;
    return this.postService.getAllMyPost(user.id);
  }

  @Get('/:id')
  getPostById(@Param('id') id: number): Promise<PostOutput> {
    return this.postService.getPostById(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  createPost(@Body() { title, content }: CreatePostDto, @Req() req: Request) {
    return this.postService.createPost({
      user: req.user as User,
      title,
      content,
    });
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  async updatePost(
    @Param('id') id: number,
    @Body() { title, content }: CreatePostDto,
    @Req() req: Request,
  ): Promise<PostOutput> {
    const { success, post } = await this.postService.getPostById(id);
    console.log(post);
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
  @UseGuards(AuthGuard)
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
