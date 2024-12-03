import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 创建权限
  const createPost = await prisma.permission.create({
    data: { name: 'create:post', description: 'Can create posts' },
  });
  const deletePost = await prisma.permission.create({
    data: { name: 'delete:post', description: 'Can delete posts' },
  });

  // 创建角色
  await prisma.role.create({
    data: {
      name: 'user',
      description: 'Regular user',
      permissions: {
        connect: [{ id: createPost.id }],
      },
    },
  });

  await prisma.role.create({
    data: {
      name: 'admin',
      description: 'Administrator',
      permissions: {
        connect: [{ id: createPost.id }, { id: deletePost.id }],
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });