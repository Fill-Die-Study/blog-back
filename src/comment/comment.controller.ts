import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { Public } from 'src/auth/auth.decorator';
import { User } from 'src/users/entities/user.entity';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Public()
  @Get()
  async getAllComments() {
    return this.commentService.getAllComments();
  }

  @Get()
  async getCommentsByMe() {}

  @Post('/create/:postId')
  async createComment(@Param('postId') postId: number, @Req() req, @Body() { content }: CreateCommentDto) {
    const user = req.user as User;
    return this.commentService.createComment(postId, user, content);
  }

  @Post('/update/:commentId')
  updateComment(@Param('commentId') commentId: number, @Req() req, @Body() body: UpdateCommentDto) {
    const user = req.user as User;
    return this.commentService.updateComment(commentId, user, body.content);
  }

  @Delete('/:commentId')
  deleteComment(@Param('commentId') commentId: number, @Req() req) {
    const user = req.user as User;
    return this.commentService.deleteComment(commentId, user);
  }
}
