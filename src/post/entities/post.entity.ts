import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('increment')
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @Column({ type: 'varchar' })
  @IsString()
  content: string;

  //   @ManyToOne(() => User, (user) => user.posts)
  //   @JoinColumn({ name: 'user_id' })
  //   author: User['userId'];

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @DeleteDateColumn()
  deleteAt: Date | null;
}
