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
   * Creates a position coordinate in the database.
   *
   * @param {string} sessionId - The ID of the session associated with the position.
   * @param {number} x - The x coordinate of the position.
   * @param {number} y - The y coordinate of the position.
   * @param {Date} timestamp - The timestamp of when the position was recorded.
   * @returns {Promise<Coordinate>} - A promise that resolves with the created position coordinate.
   * @throws {DatabaseError} - If there's an error during the creation process.
   */
  public async createPosition(
    sessionId: string,
    x: number,
    y: number,
    timestamp: Date,
  ): Promise<Coordinate> {
    return this.createCoordinate({
      sessionId,
      x,
      y,
      timestamp,
      type: this.positionCoordinateType,
    });
  }

  /**
   * Creates a boundary coordinate
   *
   * @param {string} sessionId - The ID of the session associated with the boundary.
   * @param {number} x - The x coordinate of the boundary.
   * @param {number} y - The y coordinate of the boundary.
   * @param {Date} timestamp - The timestamp of when the boundary was recorded.
   * @returns {Promise<Coordinate>} - A promise that resolves with the created boundary coordinate.
   * @throws {DatabaseError} - If there's an error during the creation process.
   */
  public async createBoundary(
    sessionId: string,
    x: number,
    y: number,
    timestamp: Date,
  ): Promise<Coordinate> {
    return this.createCoordinate({
      sessionId,
      x,
      y,
      timestamp,
      type: this.boundaryCoordinateType,
    });
  }

  /**
   * Creates an obstacle coordinate with an associated collision avoidance event in the database.
   *
   * @param {string} sessionId - The ID of the session associated with the obstacle.
   * @param {number} x - The x coordinate of the obstacle.
   * @param {number} y - The y coordinate of the obstacle.
   * @param {Date} timestamp - The timestamp of when the obstacle was recorded.
   * @param {string} imagePath - The file path of the image representing the obstacle.
   * @param {string} object - A description of the object that represents the obstacle.
   * @returns {Promise<Coordinate & { obstacle: Obstacle }>} - A promise that resolves with the created obstacle and its associated coordinate.
   * @throws {DatabaseError} - If there's an error during the creation process.
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

  public async getCurrentPosition(): Promise<Coordinate | null> {
    try {
      return await this.databaseClient.coordinate.findFirst({
        where: {
          type: this.positionCoordinateType,
        },
        orderBy: {
          timestamp: 'desc',
        },
      });
    } catch (error: unknown) {
      console.log(error);
      throw new DatabaseError();
    }
  }

  public async findAllBoundariesBySessionId(
    sessionId: string,
  ): Promise<Coordinate[]> {
    try {
      return this.databaseClient.coordinate.findMany({
        where: {
          sessionId,
          type: this.boundaryCoordinateType,
        },
      });
    } catch (error: unknown) {
      console.log(error);
      throw new DatabaseError();
    }
  }

  public async findAllBoundaries(): Promise<Coordinate[]> {
    try {
      return this.databaseClient.coordinate.findMany({
        where: {
          type: this.boundaryCoordinateType,
        },
      });
    } catch (error: unknown) {
      console.log(error);
      throw new DatabaseError();
    }
  }

  /**
   * A private helper method to create a coordinate in the database.
   *
   * @param {Omit<Coordinate, 'id'>} coordinateData - The coordinate data without the ID, including session ID, x, y, timestamp, and type.
   * @returns {Promise<Coordinate>} - A promise that resolves with the created coordinate.
   * @throws {DatabaseError} - If there's an error during the creation process.
   */
  private async createCoordinate(
    coordinateData: Omit<Coordinate, 'id'>,
  ): Promise<Coordinate> {
    try {
      const coordinate: Coordinate =
        await this.databaseClient.coordinate.create({
          data: coordinateData,
        });
      return coordinate;
    } catch (error: unknown) {
      console.log(error);
      throw new DatabaseError();
    }
  }
}
