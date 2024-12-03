import { PrismaClient } from '@prisma/client';
import { PaginationParams } from '../types/common';

const prisma = new PrismaClient();

export class MenuManagementService {
  async findMenus(params: PaginationParams & {
    search?: string;
    parentId?: number | null;
  }) {
    const { page = 1, pageSize = 10, search, parentId } = params;
    const where = {
      AND: [
        search ? {
          OR: [
            { name: { contains: search } },
            { code: { contains: search } }
          ]
        } : {},
        parentId !== undefined ? { parentId } : {}
      ]
    };

    const [total, menus] = await Promise.all([
      prisma.menu.count({ where }),
      prisma.menu.findMany({
        where,
        include: {
          parent: true,
          children: true,
          roles: {
            include: {
              role: true
            }
          }
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: [
          { sort: 'asc' },
          { createdAt: 'desc' }
        ]
      })
    ]);

    return {
      total,
      items: menus,
      page,
      pageSize
    };
  }

  async createMenu(data: {
    name: string;
    code: string;
    parentId?: number;
    sort?: number;
    remark?: string;
  }) {
    return prisma.menu.create({
      data,
      include: {
        parent: true,
        children: true
      }
    });
  }

  async updateMenu(id: number, data: {
    name?: string;
    code?: string;
    parentId?: number | null;
    sort?: number;
    remark?: string;
  }) {
    return prisma.menu.update({
      where: { id },
      data,
      include: {
        parent: true,
        children: true,
        roles: {
          include: {
            role: true
          }
        }
      }
    });
  }

  async deleteMenu(id: number) {
    // 检查是否有子菜单
    const hasChildren = await prisma.menu.findFirst({
      where: { parentId: id }
    });

    if (hasChildren) {
      throw new Error('Cannot delete menu with children');
    }

    await prisma.menu.delete({
      where: { id }
    });
  }

  async findMenuById(id: number) {
    return prisma.menu.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        roles: {
          include: {
            role: true
          }
        }
      }
    });
  }

  async getMenuTree() {
    const menus = await prisma.menu.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: true
          }
        }
      },
      orderBy: { sort: 'asc' }
    });

    return menus;
  }
}