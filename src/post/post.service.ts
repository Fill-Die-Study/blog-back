import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  create(createPostDto: CreatePostDto) {
    const post = this.postRepository.create(createPostDto);
    return this.postRepository.save(post);
  }

  findAll() {
    return this.postRepository.find();
  }

  findOne(id: number) {
    return this.postRepository.findOneBy({ id });
  }

  // findMyPosts(user_id: string) {
  //   return this.postRepository.findBy({ author: user_id });
  // }

  update(id: number, updatePostDto: UpdatePostDto) {
    const post = this.postRepository.create(updatePostDto);
    return this.postRepository.update({ id }, post);
  }

  remove(id: number) {
    return this.postRepository.delete({ id });
  }
}
