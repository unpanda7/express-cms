import { PrismaClient } from '@prisma/client'
import { fakerZH_CN as faker } from '@faker-js/faker'
import Logger from '../src/lib/logger'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  Logger.info('开始初始化数据...')

  // 1. 创建基础权限
  Logger.info('创建权限...')
  const permissions = await Promise.all([
    // 用户权限
    prisma.permission.create({ data: { name: 'read:users', description: '查看用户列表' } }),
    prisma.permission.create({ data: { name: 'create:users', description: '创建用户' } }),
    prisma.permission.create({ data: { name: 'update:users', description: '更新用户' } }),
    prisma.permission.create({ data: { name: 'delete:users', description: '删除用户' } }),
    prisma.permission.create({ data: { name: 'assign:roles', description: '分配角色' } }),
    // 角色权限
    prisma.permission.create({ data: { name: 'read:roles', description: '查看角色列表' } }),
    prisma.permission.create({ data: { name: 'create:roles', description: '创建角色' } }),
    prisma.permission.create({ data: { name: 'update:roles', description: '更新角色' } }),
    prisma.permission.create({ data: { name: 'delete:roles', description: '删除角色' } }),
    // 菜单权限
    prisma.permission.create({ data: { name: 'read:menus', description: '查看菜单列表' } }),
    prisma.permission.create({ data: { name: 'create:menus', description: '创建菜单' } }),
    prisma.permission.create({ data: { name: 'update:menus', description: '更新菜单' } }),
    prisma.permission.create({ data: { name: 'delete:menus', description: '删除菜单' } }),
    // 文章权限
    prisma.permission.create({ data: { name: 'read:posts', description: '查看文章列表' } }),
    prisma.permission.create({ data: { name: 'create:posts', description: '创建文章' } }),
    prisma.permission.create({ data: { name: 'update:posts', description: '更新文章' } }),
    prisma.permission.create({ data: { name: 'delete:posts', description: '删除文章' } }),
    prisma.permission.create({ data: { name: 'publish:posts', description: '发布文章' } })
  ])

  // 2. 创建角色
  Logger.info('创建角色...')
  const adminRole = await prisma.role.create({
    data: {
      name: 'admin',
      description: '系统管理员',
      sort: 0,
      permissions: {
        connect: permissions.map(p => ({ id: p.id }))
      }
    }
  })

  const editorRole = await prisma.role.create({
    data: {
      name: 'editor',
      description: '内容编辑',
      sort: 1,
      permissions: {
        connect: permissions
          .filter(p => p.name.startsWith('read:') || p.name.includes('post'))
          .map(p => ({ id: p.id }))
      }
    }
  })

  const userRole = await prisma.role.create({
    data: {
      name: 'user',
      description: '普通用户',
      sort: 2,
      permissions: {
        connect: permissions
          .filter(p => p.name.startsWith('read:'))
          .map(p => ({ id: p.id }))
      }
    }
  })

  // 3. 创建菜单树
  Logger.info('创建菜单...')
  const systemMenu = await prisma.menu.create({
    data: {
      name: '系统管理',
      code: 'system',
      path: '/system',
      sort: 0
    }
  })

  const userMenu = await prisma.menu.create({
    data: {
      name: '用户管理',
      code: 'system:user',
      path: '/system/user',
      parentId: systemMenu.id,
      sort: 0
    }
  })

  const roleMenu = await prisma.menu.create({
    data: {
      name: '角色管理',
      code: 'system:role',
      path: '/system/role',
      parentId: systemMenu.id,
      sort: 1
    }
  })

  const menuMenu = await prisma.menu.create({
    data: {
      name: '菜单管理',
      code: 'system:menu',
      path: '/system/menu',
      parentId: systemMenu.id,
      sort: 2
    }
  })

  const contentMenu = await prisma.menu.create({
    data: {
      name: '内容管理',
      code: 'content',
      path: '/content',
      sort: 1
    }
  })

  const postMenu = await prisma.menu.create({
    data: {
      name: '文章管理',
      code: 'content:post',
      path: '/content/post',
      parentId: contentMenu.id,
      sort: 0
    }
  })

  // 4. 创建默认管理员用户
  Logger.info('创建默认用户...')
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      username: 'admin',
      password: adminPassword,
      phone: '13800138000',
      roles: {
        create: {
          role: {
            connect: { id: adminRole.id }
          }
        }
      }
    }
  })

  // 5. 创建一些测试用户
  const users = await Promise.all(
    Array(5).fill(0).map(async (_, index) => {
      const password = await bcrypt.hash('password123', 10)
      return prisma.user.create({
        data: {
          email: faker.internet.email(),
          username: faker.internet.userName(),
          password: password,
          phone: faker.phone.number('1##########'),
          roles: {
            create: {
              role: {
                connect: { id: index === 0 ? editorRole.id : userRole.id }
              }
            }
          }
        }
      })
    })
  )

  // 6. 创建一些示例文章
  Logger.info('创建示例文章...')
  const posts = await Promise.all(
    Array(20).fill(0).map((_, index) =>
      prisma.post.create({
        data: {
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraphs(),
          published: index < 10, // 一半发布，一半未发布
          authorId: index < 5 ? admin.id : users[index % users.length].id
        }
      })
    )
  )

  Logger.info('数据初始化完成！')
  Logger.info(`
    创建了:
    - ${permissions.length} 个权限
    - ${3} 个角色 (admin, editor, user)
    - ${6} 个菜单项
    - ${users.length + 1} 个用户
    - ${posts.length} 篇文章
  `)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
