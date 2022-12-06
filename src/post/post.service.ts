import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throws } from 'assert';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePostDto, PostOutput } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { Tag } from './entities/tag.entity';
import { TagService } from './tag.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    private readonly tagService: TagService,
  ) {}

  async getAllPost(): Promise<PostOutput> {
    try {
      const posts = await this.postRepository.find({
        relations: { user: true, comments: true, tags: true },
      });
      return {
        statusCode: HttpStatus.OK,
        posts,
      };
    } catch (error) {
      throw error;
      // return {
      //   success: false,
      //   error,
      // };
    }
  }

  async getAllMyPost(user_id: number): Promise<PostOutput> {
    try {
      const posts = await this.postRepository.find({
        where: { user: { id: user_id } },
        relations: {
          user: true,
          comments: true,
          tags: true,
        },
      });
      return {
        statusCode: HttpStatus.OK,
        posts,
      };
    } catch (error) {
      throw error;
    }
  }

  async getPostByUserId(id: number): Promise<PostOutput> {
    try {
      const posts = await this.postRepository.find({
        where: {
          user: { id },
        },
        relations: {
          comments: true,
          tags: true,
        },
      });

      if (!posts) {
        throw new NotFoundException('게시글을 찾을 수 없습니다.');
      }

      return {
        statusCode: HttpStatus.OK,
        posts,
      };
    } catch (error) {
      throw error;
    }
  }

  async getPostByUrl(postUrl: string): Promise<PostOutput> {
    try {
      const post = await this.postRepository.findOne({
        where: {
          postUrl,
        },
        relations: {
          user: true,
          comments: true,
          tags: true,
        },
      });

      if (!post) {
        throw new NotFoundException('게시글을 찾을 수 없습니다');
      }

      return {
        statusCode: HttpStatus.OK,
        post,
      };
    } catch (error) {
      throw error;
    }
  }

  async getPostById(id: number): Promise<PostOutput> {
    try {
      const post = await this.postRepository.findOne({
        where: {
          id,
        },
        relations: {
          user: true,
          comments: true,
          tags: true,
        },
      });

      if (!post) {
        throw new NotFoundException('게시글을 찾을 수 없습니다');
      }

      return {
        statusCode: HttpStatus.OK,
        post,
      };
    } catch (error) {
      throw error;
    }
  }

  // TODO: tag name or tag id
  async getPostByTag(tag_id: number): Promise<PostOutput> {
    try {
      const posts = await this.postRepository.find({
        where: { tags: { id: tag_id } },
        relations: {
          user: true,
          comments: true,
          tags: true,
        },
      });

      if (!posts) {
        throw new NotFoundException('게시글을 찾을 수 없습니다.');
        // return { success: false, error: '게시글을 찾을 수 없습니다.' };
      }

      return { statusCode: HttpStatus.OK, posts };
    } catch (error) {
      throw error;
    }
  }

  async createPost(createPostBody: CreatePostDto, author: User): Promise<PostOutput> {
    try {
      const { tagNames, ...createPostInfo } = createPostBody;

      const post = this.postRepository.create({
        ...createPostInfo,
        user: author,
      });

      post.tags = await this.tagService.saveTags(post, tagNames);

      await this.postRepository.save(post);
      return { statusCode: HttpStatus.OK };
    } catch (error) {
      throw error;
    }
  }

  async updatePost(id: number, user: User, updatePostBody: UpdatePostDto): Promise<PostOutput> {
    const { tagNames, ...updatePostInfo } = updatePostBody;

    try {
      const post = await this.postRepository.findOne({
        where: {
          id,
        },
        relations: {
          user: true,
          tags: true,
        },
      });

      if (!post) {
        throw new NotFoundException('게시글을 찾을 수 없습니다.');
      }

      if (post.user.id !== user.id) {
        throw new ForbiddenException('권한이 없습니다.');
      }

      const tags = await this.tagService.saveTags(post, tagNames);
      // post.tags = await this.tagService.saveTags(post, tagNames);

      await this.postRepository.save({ ...post, ...updatePostInfo, tags });

      return {
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }

  async deletePost(id: number): Promise<PostOutput> {
    try {
      await this.postRepository.delete({ id });
      return {
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }
}
