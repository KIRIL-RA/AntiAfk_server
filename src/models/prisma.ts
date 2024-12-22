import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({
    datasources: {
      db: {
        url: 'file:./database.db'
      },
    },
  });

export default prisma;