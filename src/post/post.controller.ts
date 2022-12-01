import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { Public } from 'src/auth/auth.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreatePostDto, PostOutput } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
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
    @Param('id') postId: number,
    @Body() updatePostBody: UpdatePostDto,
    @Req() req: Request,
  ): Promise<PostOutput> {
    const user = req.user as User;

    return this.postService.updatePost(postId, user, updatePostBody);
  }

  @Delete('/:id')
  async deletePost(@Param('id') id: number, @Req() req: Request) {
    const { post } = await this.postService.getPostById(id);
    const user = req.user as User;
    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    if (post.user.id !== user.id) {
      throw new ForbiddenException();
    }

    return this.postService.deletePost(id);
  }
}
