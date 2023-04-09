import { PrismaClient, Mower, Prisma } from '@prisma/client';
import { DatabaseError, MowerAlreadyExists } from '../errors';
export { Mower };

export class MowerRepository {
  constructor(private databaseClient: PrismaClient) {}

  public async create(serial: string, status: string): Promise<Mower> {
    try {
      const now = new Date();
      const mower = await this.databaseClient.mower.create({
        data: {
          serial: serial,
          status: status,
          createdAt: now,
          updatedAt: now,
        },
      });
      return mower;
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      )
        throw new MowerAlreadyExists();
      throw new DatabaseError();
    }
  }

  public async findBySerial(serial: string): Promise<Mower | null> {
    try {
      return this.databaseClient.mower.findUnique({
        where: {
          serial: serial,
        },
      });
    } catch (error: unknown) {
      throw new DatabaseError();
    }
  }

  public async updateStatus(serial: string, status: string) {
    try {
      const now = new Date();
      const mower = await this.databaseClient.mower.update({
        where: {
          serial: serial,
        },
        data: {
          status: status,
          updatedAt: now,
        },
      });
      return mower;
    } catch (error: unknown) {
      throw new DatabaseError();
    }
  }
}
