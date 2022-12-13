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
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Public } from 'src/auth/auth.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreatePostDto, PostOutput } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

const MOCK_RESPONSE = {
  statusCode: 200,
  post: {
    id: 3,
    createAt: '2022-11-30T23:41:38.081Z',
    updateAt: '2022-11-30T23:41:38.081Z',
    deleteAt: null,
    title: 'tmemp5',
    content: '<p>asdasdasd</p>',
    thumbnailUrl: '',
    description: '',
    isPrivate: false,
    likeCount: 0,
    postUrl: '1512312412451',
    user: {
      id: 2,
      createAt: '2022-12-06T01:01:30.642Z',
      updateAt: '2022-12-06T01:01:30.642Z',
      deleteAt: null,
      email: '3@3.com',
      role: 0,
    },
    comments: [],
    tags: [
      {
        id: 1,
        createAt: '2022-11-28T00:51:15.591Z',
        updateAt: '2022-11-28T00:51:15.591Z',
        deleteAt: null,
        name: 'a',
      },
      {
        id: 7,
        createAt: '2022-11-28T01:09:35.105Z',
        updateAt: '2022-11-28T01:09:35.105Z',
        deleteAt: null,
        name: 'f',
      },
      {
        id: 8,
        createAt: '2022-11-28T01:13:20.749Z',
        updateAt: '2022-11-28T01:13:20.749Z',
        deleteAt: null,
        name: 'gggsad-asda-fw-fa-daw---dwada',
      },
    ],
  },
};

const MOCK_RESPONSES = {
  statusCode: 200,
  posts: [
    {
      id: 1,
      createAt: '2022-11-30T23:41:22.818Z',
      updateAt: '2022-11-30T23:41:22.818Z',
      deleteAt: null,
      title: 'tmemp5',
      content: '<p>asdasdasd</p>',
      thumbnailUrl: '',
      description: '',
      isPrivate: false,
      likeCount: 0,
      postUrl: '151231251',
      user: {
        id: 2,
        createAt: '2022-12-06T01:01:30.642Z',
        updateAt: '2022-12-06T01:01:30.642Z',
        deleteAt: null,
        email: '3@3.com',
        role: 0,
      },
      comments: [],
      tags: [
        {
          id: 1,
          createAt: '2022-11-28T00:51:15.591Z',
          updateAt: '2022-11-28T00:51:15.591Z',
          deleteAt: null,
          name: 'a',
        },
        {
          id: 7,
          createAt: '2022-11-28T01:09:35.105Z',
          updateAt: '2022-11-28T01:09:35.105Z',
          deleteAt: null,
          name: 'f',
        },
        {
          id: 8,
          createAt: '2022-11-28T01:13:20.749Z',
          updateAt: '2022-11-28T01:13:20.749Z',
          deleteAt: null,
          name: 'gggsad-asda-fw-fa-daw---dwada',
        },
      ],
    },
    {
      id: 3,
      createAt: '2022-11-30T23:41:38.081Z',
      updateAt: '2022-11-30T23:41:38.081Z',
      deleteAt: null,
      title: 'tmemp5',
      content: '<p>asdasdasd</p>',
      thumbnailUrl: '',
      description: '',
      isPrivate: false,
      likeCount: 0,
      postUrl: '1512312412451',
      user: {
        id: 2,
        createAt: '2022-12-06T01:01:30.642Z',
        updateAt: '2022-12-06T01:01:30.642Z',
        deleteAt: null,
        email: '3@3.com',
        role: 0,
      },
      comments: [],
      tags: [
        {
          id: 1,
          createAt: '2022-11-28T00:51:15.591Z',
          updateAt: '2022-11-28T00:51:15.591Z',
          deleteAt: null,
          name: 'a',
        },
        {
          id: 7,
          createAt: '2022-11-28T01:09:35.105Z',
          updateAt: '2022-11-28T01:09:35.105Z',
          deleteAt: null,
          name: 'f',
        },
        {
          id: 8,
          createAt: '2022-11-28T01:13:20.749Z',
          updateAt: '2022-11-28T01:13:20.749Z',
          deleteAt: null,
          name: 'gggsad-asda-fw-fa-daw---dwada',
        },
      ],
    },
  ],
};

@Controller('posts')
@ApiTags('Posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: '게시글 전체 조회',
  })
  @ApiCreatedResponse({
    schema: {
      example: MOCK_RESPONSES,
    },
  })
  getAllPost() {
    return this.postService.getAllPost();
  }

  @Public()
  @Get('/user/:id')
  @ApiOperation({
    summary: '해당 id를 가진 유저의 게시글 전체 조회',
  })
  @ApiCreatedResponse({
    schema: {
      example: MOCK_RESPONSES,
    },
  })
  getPostByUserId(@Param('id') id: number) {
    return this.postService.getPostByUserId(id);
  }

  @Public()
  @Get('/:userId/:postSlug')
  @ApiOperation({
    summary: '게시글 url을 통한 게시글 조회',
  })
  @ApiCreatedResponse({
    schema: {
      example: MOCK_RESPONSE,
    },
  })
  getPostByUrl(@Param('userId') userId: string, @Param('postSlug') postSlug: string): Promise<PostOutput> {
    return this.postService.getPostByUrl(`${userId}/${postSlug}`);
  }

  @Get('/me')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '본인 게시글 전체 조회',
  })
  @ApiCreatedResponse({
    schema: {
      example: MOCK_RESPONSES,
    },
  })
  async getAllMyPost(@Req() req: Request): Promise<PostOutput> {
    const user = req.user as User;
    return this.postService.getAllMyPost(user.id);
  }

  @Public()
  @Get('/:id')
  @ApiOperation({
    summary: '게시글 id를 통한 게시글 조회',
  })
  @ApiCreatedResponse({
    schema: {
      example: MOCK_RESPONSE,
    },
  })
  async getPostById(@Param('id') id: number) {
    return this.postService.getPostById(id);
  }

  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '게시글 생성',
  })
  @ApiCreatedResponse({
    schema: {
      example: { statusCode: HttpStatus.OK },
    },
  })
  createPost(@Body() createPostBody: CreatePostDto, @Req() req: Request) {
    return this.postService.createPost(createPostBody, req.user as User);
  }

  @Post('/:id')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '해당 id를 가진 게시글 수정',
  })
  @ApiCreatedResponse({
    schema: {
      example: { statusCode: HttpStatus.OK },
    },
  })
  async updatePost(
    @Param('id') postId: number,
    @Body() updatePostBody: UpdatePostDto,
    @Req() req: Request,
  ): Promise<PostOutput> {
    const user = req.user as User;

    return this.postService.updatePost(postId, user, updatePostBody);
  }

  @Delete('/:id')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '해당 id를 가진 게시글 삭제',
  })
  @ApiCreatedResponse({
    schema: {
      example: { statusCode: HttpStatus.OK },
    },
  })
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
