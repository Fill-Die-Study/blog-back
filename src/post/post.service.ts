import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePostDto, PostOutput } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { Tag } from './entities/tag.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
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
      throw new InternalServerErrorException(`${error}`);
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
        },
      });
      return {
        statusCode: HttpStatus.OK,
        posts,
      };
    } catch (error) {
      throw new InternalServerErrorException(`${error}`);
    }
  }

  async getPostById(id: number): Promise<PostOutput> {
    try {
      const post = await this.postRepository.findOne({
        where: {
          id,
        },
        relations: { user: true },
      });

      if (!post) {
        throw new NotFoundException('게시글을 찾을 수 없습니다');
      }

      return {
        statusCode: HttpStatus.OK,
        post,
      };
    } catch (error) {
    }
  }

  async createPost(
    createPostBody: CreatePostDto,
    author: User,
  ): Promise<PostOutput> {
    try {
      const { tagNames, ...createPostInfo } = createPostBody;

      const post = this.postRepository.create({
        ...createPostInfo,
        user: author,
      });

      const tagSlugs = tagNames.map((tagName) =>
        tagName.trim().toLowerCase().replace(/ /g, '-'),
      );

      const saveTag = async (tagSlug: string) => {
        const tag = await this.tagRepository.findOne({
          where: { name: tagSlug },
          relations: { posts: true },
        });

        let newTag: Tag;

        if (!tag) {
          newTag = this.tagRepository.create({
            name: tagSlug,
            posts: [post],
          });
        } else {
          newTag = {
            ...tag,
            posts: [...tag.posts, post],
          };
        }

        return await this.tagRepository.save(newTag);
      };

      const tags = (
        await Promise.allSettled(tagSlugs.map((tagSlug) => saveTag(tagSlug)))
      ).map((promiseRes) =>
        promiseRes.status === 'fulfilled' ? promiseRes.value : undefined,
      );

      post.tags = tags;

      await this.postRepository.save(post);
      return { statusCode: HttpStatus.OK };
    } catch (error) {
      throw new InternalServerErrorException(`${error}`);
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
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new InternalServerErrorException(`${error}`);
    }
  }

  async deletePost(id: number): Promise<PostOutput> {
    try {
      await this.postRepository.delete({ id });
      return {
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new InternalServerErrorException(`${error}`);
    }
  }
}
