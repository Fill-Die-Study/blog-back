import { Comment } from '../entities/comment.entity';
import { PickType } from '@nestjs/swagger';
import { CommonOutput } from 'src/common/dtos/commonOutput.dto';

export class CreateCommentDto extends PickType(Comment, ['content']) {}

export class CommentOutput extends CommonOutput {
  comments?: Comment[];
  comment?: Comment;
}
