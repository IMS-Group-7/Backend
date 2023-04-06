import { PrismaClient } from '@prisma/client';

class DatabaseClient {
  private static instance: PrismaClient | null = null;

  public static getInstance() {
    if (!DatabaseClient.instance) {
      DatabaseClient.instance = new PrismaClient();
    }
    return DatabaseClient.instance;
  }
}

export const databaseClient = DatabaseClient.getInstance();
