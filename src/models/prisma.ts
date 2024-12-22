import { Prisma, PrismaClient } from '@prisma/client';
import { config } from '../configs/config_loader'

const prisma = new PrismaClient({
    datasources: {
      db: {
        url: config.dbUrl
      },
    },
  });

export default prisma;