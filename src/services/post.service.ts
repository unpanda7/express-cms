import { PrismaClient } from '@prisma/client';
import { PaginationParams } from '../types/common';
import Logger from '../lib/logger';

const prisma = new PrismaClient();

export class PostService {
  async findPosts(params: PaginationParams & {
    search?: string;
    published?: boolean;
    authorId?: number;
  }) {
    const { page = 1, pageSize = 10, search, published, authorId } = params;
    const where = {
      AND: [
        search ? {
          OR: [
            { title: { contains: search } },
            { content: { contains: search } }
          ]
        } : {},
        published !== undefined ? { published } : {},
        authorId ? { authorId } : {}
      ]
    };

    const [total, posts] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              email: true
            }
          }
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return {
      total,
      items: posts,
      page,
      pageSize
    };
  }

  async createPost(data: {
    title: string;
    content?: string;
    published?: boolean;
    authorId: number;
  }) {
    const post = await prisma.post.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    const { author, ...postData } = post;

    return {
      ...postData,
      username: author.username
    };
  }

  async updatePost(id: number, data: {
    title?: string;
    content?: string;
    published?: boolean;
  }) {
    const post = await prisma.post.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    const { author, ...postData } = post;

    return {
      ...postData,
      username: author.username
    };
  }

  async deletePost(id: number) {
    await prisma.post.delete({
      where: { id }
    });
  }

  async findPostById(id: number) {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            username: true
          }
        }
      }
    });

    const { author, ...postData } = post;

    return {
      ...postData,
      username: author.username
    };
  }

  async publishPost(id: number) {
    return prisma.post.update({
      where: { id },
      data: { published: true }
    });
  }

  async unpublishPost(id: number) {
    return prisma.post.update({
      where: { id },
      data: { published: false }
    });
  }
}
