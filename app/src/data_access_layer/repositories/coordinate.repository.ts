import { Coordinate, PrismaClient, Obstacle } from '@prisma/client';
import { CoordinateType } from '../coordinate.type';
import { DatabaseError } from '../errors';
export { Coordinate, Obstacle };

export class CoordinateRepository {
  private positionCoordinateType: CoordinateType = 'Position';
  private boundaryCoordinateType: CoordinateType = 'Boundary';
  private obstacleCoordinateType: CoordinateType = 'Obstacle';

  constructor(private databaseClient: PrismaClient) {}

  /**
   * Creates a position coordinate
   *
   * @param sessionId The ID of the session associated with the position.
   * @param x The x coordinate of the position.
   * @param y The y coordinate of the position.
   * @param timestamp The timestamp of when the position was recorded.
   * @returns The created position coordinate.
   * @throws DatabaseError if there is any error during the operation.
   */
  public async createPosition(
    sessionId: string,
    x: number,
    y: number,
    timestamp: Date,
  ): Promise<Coordinate> {
    return await this.createCoordinate(
      sessionId,
      x,
      y,
      timestamp,
      this.positionCoordinateType,
    );
  }

  /**
   * Creates a boundary coordinate
   *
   * @param sessionId The ID of the session associated with the boundary.
   * @param x The x coordinate of the boundary.
   * @param y The y coordinate of the boundary.
   * @param timestamp The timestamp of when the boundary was recorded.
   * @returns The created boundary coordinate.
   * @throws DatabaseError if there is any error during the operation.
   */
  public async createBoundary(
    sessionId: string,
    x: number,
    y: number,
    timestamp: Date,
  ): Promise<Coordinate> {
    return await this.createCoordinate(
      sessionId,
      x,
      y,
      timestamp,
      this.boundaryCoordinateType,
    );
  }

  /**
   * Creates a new obstacle coordinate (collision avoidance event)
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
  public async createObstacle(
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
            type: this.obstacleCoordinateType,
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
   * Finds an obstacle by its ID and includes the associated coordinate.
   *
   * @param id The ID of the obstacle to be fetched.
   * @returns The obstacle with the specified ID and its associated coordinate, or null if not found.
   * @throws DatabaseError if there is any error during the operation.
   */
  public async findObstacleById(id: string): Promise<
    | (Obstacle & {
        coordinate: Coordinate;
      })
    | null
  > {
    try {
      return await this.databaseClient.obstacle.findFirst({
        include: {
          coordinate: true,
        },
        where: {
          id,
        },
      });
    } catch (error: unknown) {
      console.log(error);
      throw new DatabaseError();
    }
  }

  /**
   * A private helper method to create a coordinate with a specific type.
   *
   * @param sessionId The ID of the session associated with the coordinate.
   * @param x The x coordinate of the coordinate.
   * @param y The y coordinate of the coordinate.
   * @param timestamp The timestamp of when the coordinate was recorded.
   * @param type The type of the coordinate (Position, Boundary, or Obstacle).
   * @returns The created coordinate.
   * @throws DatabaseError if there is any error during the operation.
   */
  private async createCoordinate(
    sessionId: string,
    x: number,
    y: number,
    timestamp: Date,
    type: CoordinateType,
  ): Promise<Coordinate> {
    try {
      const coordinate: Coordinate =
        await this.databaseClient.coordinate.create({
          data: {
            sessionId,
            x,
            y,
            timestamp,
            type,
          },
        });
      return coordinate;
    } catch (error: unknown) {
      console.log(error);
      throw new DatabaseError();
    }
  }
}
