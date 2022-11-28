import { Injectable } from '@nestjs/common';
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
        relations: { user: true },
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
      const post = await this.postRepository.findOne({
        where: {
          id,
        },
        relations: { user: true },
      });
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

      console.log(post);

      await this.postRepository.save(
        this.postRepository.create({ ...post, tags }),
      );
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
