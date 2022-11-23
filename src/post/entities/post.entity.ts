import { IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Post extends CommonEntity {
  @Column()
  @IsString()
  title: string;

  @Column()
  @IsString()
  content: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  // TODO: content html script 필터링 기능
}
