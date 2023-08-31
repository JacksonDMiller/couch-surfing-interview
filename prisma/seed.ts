import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'alice@couchsurfing.com' },
    update: {},
    create: {
      email: 'alice@couchsurfing.com',
      name: 'Alice',
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@couchsurfing.com' },
    update: {},
    create: {
      email: 'bob@couchsurfing.com',
      name: 'Bob',
    },
  });

  const Jackson = await prisma.user.upsert({
    where: { email: 'Jackson@couchsurfing.com' },
    update: {},
    create: {
      email: 'Jackson@couchsurfing.com',
      name: 'Jackson',
    },
  });

  const adam = await prisma.user.upsert({
    where: { email: 'adam@couchsurfing.com' },
    update: {},
    create: {
      email: 'adam@couchsurfing.com',
      name: 'Adam',
    },
  });

  const satoshi = await prisma.user.upsert({
    where: { email: 'satoshi@couchsurfing.com' },
    update: {},
    create: {
      email: 'satoshi@couchsurfing.com',
      name: 'Satoshi',
    },
  });

  await prisma.friendship.create({
    data: {
      userId1: 1,
      userId2: 2,
    },
  });

  await prisma.friendship.create({
    data: {
      userId1: 2,
      userId2: 3,
    },
  });

  await prisma.friendship.create({
    data: {
      userId1: 1,
      userId2: 4,
    },
  });

  await prisma.friendship.create({
    data: {
      userId1: 2,
      userId2: 4,
    },
  });

  await prisma.friendship.create({
    data: {
      userId1: 3,
      userId2: 4,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
