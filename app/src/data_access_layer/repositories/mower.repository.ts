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
   * Updates the status of a mower with the specified ID.
   *
   * @param id The ID of the mower to update.
   * @param status The new status of the mower.
   * @returns The updated mower or null if the mower with the specified ID does not exist.
   * @throws DatabaseError if there is any error during the operation.
   */
  public async updateStatus(id: string, status: string): Promise<Mower | null> {
    try {
      const now = new Date();
      const mower = await this.databaseClient.mower.update({
        where: {
          id,
        },
        data: {
          status: status,
          updatedAt: now,
        },
      });
      return mower;
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      )
        return null;
      throw new DatabaseError();
    }
  }
}
