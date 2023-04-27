import {
  Coordinate,
  PrismaClient,
  Obstacle,
  Prisma,
  Session,
} from '@prisma/client';
import { CoordinateTypeEnum } from '../coordinate-type.enum';
import { DatabaseError } from '../errors';
export { Coordinate, Obstacle };

type FilterOptions = {
  where: Prisma.CoordinateWhereInput;
  orderBy?: Prisma.CoordinateOrderByWithRelationInput;
  select?: Prisma.CoordinateSelect;
  distinct?: Prisma.CoordinateScalarFieldEnum[];
};

export class CoordinateRepository {
  constructor(private databaseClient: PrismaClient) {}

  /**
   * Adds a new Position coordinate in the database.
   * @param {Omit<Coordinate, 'id' | 'type'>} coordinateData - The data for the new coordinate, excluding the id and type properties.
   * @returns {Promise<Coordinate>} The new coordinate object.
   */
  public async addPosition(
    coordinateData: Omit<Coordinate, 'id' | 'type'>,
  ): Promise<Coordinate> {
    return this.addCoordinate({
      ...coordinateData,
      type: CoordinateTypeEnum.POSITION,
    });
  }

  /**
   * Adds a new Boundary coordinate in the database.
   * @param {Omit<Coordinate, 'id' | 'type'>} coordinateData - The data for the new coordinate, excluding the id and type properties.
   * @returns {Promise<Coordinate>} The new coordinate object.
   */
  public async addBoundary(
    coordinateData: Omit<Coordinate, 'id' | 'type'>,
  ): Promise<Coordinate> {
    return this.addCoordinate({
      ...coordinateData,
      type: CoordinateTypeEnum.BOUNDARY,
    });
  }

  /**
   * Adds an obstacle coordinate with an associated collision avoidance event in the database.
   *
   * @param {Omit<Coordinate, 'id' | 'type'>} coordinateData - The data for the new coordinate and obstacle, excluding the id and type properties.
   * @param {string} imagePath - The path of the image representing the obstacle.
   * @param {string} object - A description of the object that represents the obstacle.
   * @returns {Promise<Coordinate & { obstacle: Obstacle }>} - The created coordinate and its associated obstacle.
   * @throws {DatabaseError} - If there's an error during the creation process.
   */
  public async addObstacle(
    coordinateData: Omit<Coordinate, 'id' | 'type'>,
    imagePath: string,
    object: string,
  ): Promise<Coordinate & { obstacle: Obstacle }> {
    try {
      const result = await this.databaseClient.$transaction(async (tx) => {
        const newCoordinate: Coordinate = await tx.coordinate.create({
          data: {
            ...coordinateData,
            type: CoordinateTypeEnum.OBSTACLE,
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
   * Finds all coordinates in the database based on the specified options.
   * @param {FilterOptions} findManyOptions - The options to filter, order and select the coordinates.
   * @returns {Promise<Object[]>} An array of objects containing the coordinates matching the options.
   * @throws {DatabaseError} If there's an error during the database query.
   */
  public async findAllWithFilter(findManyOptions: FilterOptions): Promise<
    {
      session?: Session | undefined;
      obstacle?: Obstacle | null | undefined;
      id?: string | undefined;
      sessionId?: string | undefined;
      x?: number | undefined;
      y?: number | undefined;
      type?: string | undefined;
      timestamp?: Date | undefined;
    }[]
  > {
    try {
      return await this.databaseClient.coordinate.findMany({
        where: findManyOptions.where,
        orderBy: findManyOptions?.orderBy,
        select: findManyOptions?.select,
        distinct: findManyOptions?.distinct,
      });
    } catch (error: unknown) {
      console.log(error);
      throw new DatabaseError();
    }
  }

  /**
   * A private helper method to add a coordinate in the database.
   *
   * @param {Omit<Coordinate, 'id'>} coordinateData - The coordinate data without the ID, including session ID, x, y, timestamp, and type.
   * @returns {Promise<Coordinate>} - A promise that resolves with the created coordinate.
   * @throws {DatabaseError} - If there's an error during the creation process.
   */
  private async addCoordinate(
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
