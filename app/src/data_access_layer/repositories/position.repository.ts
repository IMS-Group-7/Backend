import { Coordinate, PrismaClient } from '@prisma/client';
import { DatabaseError } from '../errors';
import { CoordinateType } from '../coordinate.type';
export { Coordinate };

export class PositionRepository {
  private positionCoordinateType: CoordinateType = 'Position';

  constructor(private databaseClient: PrismaClient) {}

  /**
   * Creates a new coordinate of type 'Position' with the provided data.
   *
   * @param sessionId The ID of the session associated with the new coordinate.
   * @param x The x coordinate of the new coordinate.
   * @param y The y coordinate of the new coordinate.
   * @param timestamp The timestamp of when the new coordinate was recorded.
   * @returns The newly created coordinate of type 'Position'.
   * @throws DatabaseError if there is any error during the operation.
   */
  public async create(
    sessionId: string,
    x: number,
    y: number,
    timestamp: Date,
  ): Promise<Coordinate> {
    try {
      const position: Coordinate = await this.databaseClient.coordinate.create({
        data: {
          sessionId,
          x,
          y,
          timestamp,
          type: this.positionCoordinateType,
        },
      });
      return position;
    } catch (error: unknown) {
      console.log(error);
      throw new DatabaseError();
    }
  }
}
