import { PrismaClient } from '@prisma/client';
import { PaginationParams } from "../types/common";

const prisma = new PrismaClient();

export class UserManagementService {
  async findUsers(params: PaginationParams & {
    search?: string;
    status?: boolean;
  }) {
    const { page = 1, pageSize = 10, search, status } = params;
    const where = {
      AND: [
        search ? {
          OR: [
            { username: { contains: search } },
            { email: { contains: search } },
            { phone: { contains: search } }
          ]
        } : {},
        status !== undefined ? { status } : {}
      ]
    };

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        include: {
          roles: {
            include: {
              role: true
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
      items: users.map(({ password, ...user }) => user),
      page,
      pageSize
    };
  }

  async updateUserRoles(userId: number, roleIds: number[]) {
    await prisma.userRole.deleteMany({
      where: { userId }
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        roles: {
          create: roleIds.map(roleId => ({
            role: { connect: { id: roleId } }
          }))
        }
      }
    });
  }

  async updateUser(id: number, data: {
    username?: string;
    email?: string;
    phone?: string;
    status?: boolean;
    remark?: string;
  }) {
    return prisma.user.update({
      where: { id },
      data,
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });
  }

  async deleteUser(id: number) {
    await prisma.user.delete({
      where: { id }
    });
  }
}