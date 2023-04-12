import { Obstacle, Coordinate, PrismaClient } from '@prisma/client';
import { DatabaseError } from '../errors';
import { CoordinateType } from '../coordinate.type';
export { Obstacle, Coordinate };

export class ObstacleRepository {
  private coordinateType: CoordinateType = 'Position';

  constructor(private databaseClient: PrismaClient) {}

  /**
   * Creates a new obstacle (collision avoidance event)
   *
   * @param sessionId The ID of the session associated with the obstacle.
   * @param x The x coordinate of the obstacle.
   * @param y The y coordinate of the obstacle.
   * @param timestamp The timestamp of when the obstacle was recorded.
   * @param imagePath The file path of the image representing the obstacle.
   * @param object A description of the object that represents the obstacle.
   * @returns The created obstacle with its associated coordinate.
   * @throws DatabaseError if there is any error during the operation.
   */
  public async create(
    sessionId: string,
    x: number,
    y: number,
    timestamp: Date,
    imagePath: string,
    object: string,
  ): Promise<Coordinate & { obstacle: Obstacle }> {
    try {
      const result = await this.databaseClient.$transaction(async (tx) => {
        const newCoordinate: Coordinate = await tx.coordinate.create({
          data: {
            sessionId,
            x,
            y,
            timestamp,
            type: this.coordinateType,
          },
        });

        const newObstacle: Obstacle = await tx.obstacle.create({
          data: {
            coordinateId: newCoordinate.id,
            imagePath,
            object,
          },
        });

        return { obstacle: newObstacle, ...newCoordinate };
      });

      return result;
    } catch (error: unknown) {
      console.log(error);
      throw new DatabaseError();
    }
  }

  /**
   * Finds a coordinate with the associated obstacle, if it exists, by its ID.
   *
   * @param id The ID of the obstacle to be fetched.
   * @returns The coordinate with the specified ID and associated obstacle, or null if not found.
   * @throws DatabaseError if there is any error during the operation.
   */
  public async findById(id: string): Promise<
    | (Coordinate & {
        obstacle: Obstacle | null;
      })
    | null
  > {
    try {
      return await this.databaseClient.coordinate.findFirst({
        include: {
          obstacle: true,
        },
        where: {
          type: this.coordinateType,
          obstacle: {
            id,
          },
        },
      });
    } catch (error: unknown) {
      console.log(error);
      throw new DatabaseError();
    }
  }
}
