import { PrismaClient } from '@prisma/client'
import { fakerZH_CN as faker } from '@faker-js/faker'
import Logger from '../src/lib/logger'

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.findFirst({
        where: {
            phone: '18674704903',
        },
    })
    console.log(user?.id)
    if (!user?.id) {
        return
    }

    const fakerPosts: any[] = []
    for (let i = 0; i < 10; i++) {
        fakerPosts.push({
          title: faker.word.words(5),
          content: faker.lorem.paragraphs(3),
            published: faker.datatype.boolean(),
            authorId: user.id,
        })
    }
    console.log(fakerPosts)
    await prisma.post.createMany({
        data: fakerPosts,
    })
    Logger.info(`Created ${fakerPosts.length} faker posts`)

    // delete all posts
    // await prisma.post.deleteMany()
    // Logger.info(`Deleted all posts`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
