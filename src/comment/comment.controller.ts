import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/auth.decorator';
import { User } from 'src/users/entities/user.entity';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

const MOCK_RESPONSES = {
  statusCode: 200,
  comments: [
    {
      id: 3,
      createAt: '2022-12-12T23:05:27.990Z',
      updateAt: '2022-12-12T23:05:27.990Z',
      deleteAt: null,
      content: 'adasfwvasfadasc',
      post: {
        id: 25,
        createAt: '2022-12-06T00:58:22.276Z',
        updateAt: '2022-12-06T00:58:22.276Z',
        deleteAt: null,
        title: '제목긱긱22',
        content: "# ASDAS \n#D AS DAS D A SD\n\n```ts\nconst temp = 'wowwowwow'\n```\n",
        thumbnailUrl: '',
        description: '',
        isPrivate: false,
        likeCount: 0,
        postUrl: '1/제목긱긱22',
      },
    },
    {
      id: 4,
      createAt: '2022-12-12T23:05:29.344Z',
      updateAt: '2022-12-12T23:05:29.344Z',
      deleteAt: null,
      content: 'adasfwvasfadasc',
      post: {
        id: 24,
        createAt: '2022-12-06T00:49:07.925Z',
        updateAt: '2022-12-06T00:59:41.000Z',
        deleteAt: null,
        title: '제목긱긱33',
        content: "# ASDAS \n#D AS DAS D A SD\n\n```ts\nconst temp = 'wowwowwow'\n```\n",
        thumbnailUrl: '',
        description: '',
        isPrivate: false,
        likeCount: 0,
        postUrl: '1/제목긱긱',
      },
    },
  ],
};

@Controller('comment')
@ApiTags('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: '모든 댓글 전체 조회',
  })
  @ApiCreatedResponse({
    schema: {
      example: MOCK_RESPONSES,
    },
  })
  async getAllComments() {
    return this.commentService.getAllComments();
  }

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '내가 쓴 댓글 전체 조회',
  })
  @ApiCreatedResponse({
    schema: {
      example: MOCK_RESPONSES,
    },
  })
  async getCommentsByMe() {}

  @Post('/create/:postId')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'postId를 가진 게시글에 댓글 생성',
  })
  @ApiCreatedResponse({
    schema: {
      example: { statusCode: HttpStatus.OK },
    },
  })
  async createComment(@Param('postId') postId: number, @Req() req, @Body() { content }: CreateCommentDto) {
    const user = req.user as User;
    return this.commentService.createComment(postId, user, content);
  }

  @Post('/update/:commentId')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '해당 commentId를 가진 댓글 수정',
  })
  @ApiCreatedResponse({
    schema: {
      example: { statusCode: HttpStatus.OK },
    },
  })
  updateComment(@Param('commentId') commentId: number, @Req() req, @Body() body: UpdateCommentDto) {
    const user = req.user as User;
    return this.commentService.updateComment(commentId, user, body.content);
  }

  @Delete('/:commentId')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '해당 commentId를 가진 댓글 삭제',
  })
  @ApiCreatedResponse({
    schema: {
      example: { statusCode: HttpStatus.OK },
    },
  })
  deleteComment(@Param('commentId') commentId: number, @Req() req) {
    const user = req.user as User;
    return this.commentService.deleteComment(commentId, user);
  }
}
