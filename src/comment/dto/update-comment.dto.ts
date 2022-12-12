import { Comment } from '../entities/comment.entity';
import { PickType } from '@nestjs/swagger';
import { CommonOutput } from 'src/common/dtos/commonOutput.dto';

export class UpdateCommentDto extends PickType(Comment, ['content']) {}
