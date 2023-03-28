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
