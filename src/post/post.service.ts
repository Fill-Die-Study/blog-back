import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto, PostOutput } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async getAllPost(): Promise<PostOutput> {
    try {
      const posts = await this.postRepository.find();
      return {
        success: true,
        posts,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }

  async getAllMyPost(user_id: number): Promise<PostOutput> {
    try {
      const posts = await this.postRepository.find({
        where: { user: { id: user_id } },
        relations: {
          user: true,
        },
      });
      return {
        success: true,
        posts,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }

  async getPostById(id: number): Promise<PostOutput> {
    try {
      const post = await this.postRepository.findOneBy({ id });
      return {
        success: true,
        post,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }

  async createPost({
    title,
    content,
    user,
  }: CreatePostDto): Promise<PostOutput> {
    try {
      const post = this.postRepository.create({ title, content, user });
      await this.postRepository.save(post);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }

  async updatePost({
    id,
    title,
    content,
    user,
  }: UpdatePostDto): Promise<PostOutput> {
    try {
      console.log(id);
      await this.postRepository.update({ id }, { title, content, user });
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }

  async deletePost(id: number): Promise<PostOutput> {
    try {
      await this.postRepository.delete({ id });
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }
}
