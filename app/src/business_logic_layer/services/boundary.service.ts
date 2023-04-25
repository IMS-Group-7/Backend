import { Coordinate } from '@prisma/client';
import { CoordinateRepository } from '../../data_access_layer/repositories';
import { CoordinateTypeEnum } from '../../data_access_layer/coordinate-type.enum';

export class BoundaryService {
  constructor(private coordinateRepository: CoordinateRepository) {}

  /**
   * Adds a new boundary coordinate in the database.
   *
   * @param {string} sessionId - The ID of the session associated with the boundary.
   * @param {number} x - The x coordinate of the boundary.
   * @param {number} y - The y coordinate of the boundary.
   * @returns {Promise<Coordinate>} - The created boundary coordinate.
   */
  public async add(
    sessionId: string,
    x: number,
    y: number,
  ): Promise<Coordinate> {
    const boundary: Coordinate = await this.coordinateRepository.addBoundary({
      sessionId,
      x,
      y,
      timestamp: new Date(),
    });

    return boundary;
  }

  /**
   * Finds all boundary coordinates from the database and returns them as an array of objects with x and y properties.
   * The data is used to draw a map of the mowing area.
   * @returns {Promise<{x: number, y: number}[]>} An array of objects with x and y properties.
   */
  public async findAllDistinct(): Promise<{ x: number; y: number }[]> {
    return this.coordinateRepository.findAllWithFilter({
      where: {
        type: CoordinateTypeEnum.BOUNDARY,
      },
      distinct: ['x', 'y'],
      orderBy: {
        timestamp: 'asc',
      },
      select: {
        x: true,
        y: true,
      },
    }) as Promise<{ x: number; y: number }[]>;
  }
}
