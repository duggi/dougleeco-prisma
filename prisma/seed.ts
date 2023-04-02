// prisma/seed.ts

import { PrismaClient } from '@prisma/client'
import { items } from '../data/items'
const prisma = new PrismaClient()

async function main() {
  //await prisma.user.create({
  //  data: {
  //    email: `douglee650@gmail.com`,
  //    role: 'ADMIN',
  //  },
  //})

  //await prisma.user.create({
  //  data: {
  //    email: `someuser123@gmail.com`,
  //    role: 'USER',
  //    name: 'Some User',
  //  },
  //})

  //await prisma.user.create({
  //  data: {
  //    email: `anotheruser@yahoo.com`,
  //    role: 'USER',
  //    name: 'Another User',
  //  },
  //})

  await prisma.item.createMany({
    data: items,
  })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
