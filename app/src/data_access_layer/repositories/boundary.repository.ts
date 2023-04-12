import { Coordinate, PrismaClient } from '@prisma/client';
import { CoordinateType } from '../coordinate.type';
import { DatabaseError } from '../errors';
export { Coordinate };

export class BoundaryRepository {
  private boundaryCoordinateType: CoordinateType = 'Boundary';

  constructor(private databaseClient: PrismaClient) {}

  /**
   * Creates a new boundary (outer perimeter of mowing area)
   *
   * @param sessionId The ID of the session associated with the boundary.
   * @param x The x coordinate of the boundary.
   * @param y The y coordinate of the boundary.
   * @param timestamp The timestamp of when the boundary was recorded.
   * @returns The created boundary coordinate.
   * @throws DatabaseError if there is any error during the operation.
   */
  public async create(
    sessionId: string,
    x: number,
    y: number,
    timestamp: Date,
  ): Promise<Coordinate> {
    try {
      const boundary: Coordinate = await this.databaseClient.coordinate.create({
        data: {
          sessionId,
          x,
          y,
          timestamp,
          type: this.boundaryCoordinateType,
        },
      });
      return boundary;
    } catch (error: unknown) {
      console.log(error);
      throw new DatabaseError();
    }
  }
}
