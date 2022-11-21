import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // @UseGuards(AuthGuard('jwt'))
  // @Post()
  // create(@Body() createPostDto: CreatePostDto, @Request() req) {
  //   return this.postService.create({
  //     ...createPostDto,
  //     author: req.user.user_id,
  //   });
  // }

  // @UseGuards(AuthGuard('jwt'))
  // @Get('/me')
  // findMyPosts(@Request() req) {
  //   return this.postService.findMyPosts(req.user);
  // }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
