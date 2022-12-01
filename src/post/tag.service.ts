import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async saveTags(post: Post, tagNames?: string[]) {
    try {
      if (tagNames && tagNames.length > 0) {
        const tagSlugs = tagNames.map((tagName) => tagName.trim().toLowerCase().replace(/ /g, '-'));

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

        const tags = (await Promise.allSettled(tagSlugs.map((tagSlug) => saveTag(tagSlug)))).map((promiseRes) =>
          promiseRes.status === 'fulfilled' ? promiseRes.value : undefined,
        );

        return tags;
      }
    } catch (error) {
      throw error;
    }
  }
}
