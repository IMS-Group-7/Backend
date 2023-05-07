import { PrismaClient } from '@prisma/client';

class DatabaseClient {
  private static instance: PrismaClient;

  public static getInstance() {
    if (!DatabaseClient.instance) {
      DatabaseClient.instance = new PrismaClient();
    } 
    return DatabaseClient.instance;
  }
}

export default DatabaseClient;
export { PrismaClient };