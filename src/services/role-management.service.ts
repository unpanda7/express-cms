import { PrismaClient } from '@prisma/client';
import { PaginationParams } from '../types/common';

const prisma = new PrismaClient();

export class RoleManagementService {
  async findRoles(params: PaginationParams & {
    search?: string;
  }) {
    const { page = 1, pageSize = 10, search } = params;
    const where = search ? {
      OR: [
        { name: { contains: search } },
        { description: { contains: search } }
      ]
    } : {};

    const [total, roles] = await Promise.all([
      prisma.role.count({ where }),
      prisma.role.findMany({
        where,
        include: {
          permissions: true,
          menus: {
            include: {
              menu: true
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
      items: roles,
      page,
      pageSize
    };
  }

  async createRole(data: {
    name: string;
    description?: string;
    sort?: number;
    remark?: string;
    permissionIds?: number[];
    menuIds?: number[];
  }) {
    const { permissionIds = [], menuIds = [], ...roleData } = data;

    return prisma.role.create({
      data: {
        ...roleData,
        permissions: {
          connect: permissionIds.map(id => ({ id }))
        },
        menus: {
          create: menuIds.map(menuId => ({
            menu: { connect: { id: menuId } }
          }))
        }
      },
      include: {
        permissions: true,
        menus: {
          include: {
            menu: true
          }
        }
      }
    });
  }

  async updateRole(id: number, data: {
    name?: string;
    description?: string;
    sort?: number;
    remark?: string;
    permissionIds?: number[];
    menuIds?: number[];
  }) {
    const { permissionIds, menuIds, ...roleData } = data;

    // 更新角色基本信息
    const role = await prisma.role.update({
      where: { id },
      data: roleData
    });

    // 如果提供了权限ID，更新权限
    if (permissionIds) {
      await prisma.role.update({
        where: { id },
        data: {
          permissions: {
            set: permissionIds.map(id => ({ id }))
          }
        }
      });
    }

    // 如果提供了菜单ID，更新菜单
    if (menuIds) {
      await prisma.menuRole.deleteMany({
        where: { roleId: id }
      });

      await prisma.role.update({
        where: { id },
        data: {
          menus: {
            create: menuIds.map(menuId => ({
              menu: { connect: { id: menuId } }
            }))
          }
        }
      });
    }

    return this.findRoleById(id);
  }

  async deleteRole(id: number) {
    await prisma.role.delete({
      where: { id }
    });
  }

  async findRoleById(id: number) {
    return prisma.role.findUnique({
      where: { id },
      include: {
        permissions: true,
        menus: {
          include: {
            menu: true
          }
        }
      }
    });
  }
}