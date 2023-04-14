import { PrismaClient, Mower, Prisma } from '@prisma/client';
import { DatabaseError, MowerAlreadyExistsError } from '../errors';
export { Mower };

export class MowerRepository {
  constructor(private databaseClient: PrismaClient) {}

  /**
   * Registers a new mower with the specified serial and status.
   *
   * @param serial The serial number of the new mower.
   * @param status The status of the new mower.
   * @returns The created mower.
   * @throws MowerAlreadyExistsError if a mower with the same serial number already exists.
   * @throws DatabaseError if there is any error during the operation.
   */
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
        throw new MowerAlreadyExistsError();
      throw new DatabaseError();
    }
  }

  /**
   * Finds a mower by its serial number.
   *
   * @param serial The serial number of the mower to be fetched.
   * @returns The mower with the specified serial number or null if not found.
   * @throws DatabaseError if there is any error during the operation.
   */
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

  /**
   * Finds a mower by its ID.
   *
   * @param id The ID of the mower to be fetched.
   * @returns The mower with the specified serial number or null if not found.
   * @throws DatabaseError if there is any error during the operation.
   */
  public async findById(id: string): Promise<Mower | null> {
    try {
      return this.databaseClient.mower.findUnique({
        where: {
          id,
        },
      });
    } catch (error: unknown) {
      throw new DatabaseError();
    }
  }
}
