import { PrismaClient } from '@prisma/client';

class DatabaseClient {
  private static instance: PrismaClient;

  public static getInstance() {
    if (!DatabaseClient.instance) {
      console.log("Using DATABASE_URL:", process.env.DATABASE_URL);
      DatabaseClient.instance = new PrismaClient();
    } else {
      console.log("Using existing instance of PrismaClient");
      console.log("DATABASE_URL:", process.env.DATABASE_URL);
    }
    return DatabaseClient.instance;
  }
}

export default DatabaseClient;
export { PrismaClient };