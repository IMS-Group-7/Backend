import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function prismaConnect() {
  if (!prisma.$connect) return;
  await prisma.$connect();
}

async function prismaDisconnect() {
  if (!prisma.$disconnect) return;
  await prisma.$disconnect();
}

export { prisma as default, prismaConnect, prismaDisconnect };
