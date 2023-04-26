import { Coordinate } from '@prisma/client';
import {
  CoordinateRepository,
  SessionRepository,
  Session,
} from '../../data_access_layer/repositories';
import { NotFoundError } from '../../common/errors';
import { CoordinateTypeEnum } from '../../data_access_layer/coordinate-type.enum';

export class PositionService {
  constructor(
    private coordinateRepository: CoordinateRepository,
    private sessionRepository: SessionRepository,
  ) {}

  /**
   * Adds a new position coordinate to the database.
   * @param {string} sessionId - The ID of the session associated with the coordinate.
   * @param {number} x - The x coordinate of the new position.
   * @param {number} y - The y coordinate of the new position.
   * @returns {Promise<Coordinate>} The new position coordinate object.
   */
  public async add(
    sessionId: string,
    x: number,
    y: number,
  ): Promise<Coordinate> {
    const position: Coordinate = await this.coordinateRepository.addPosition({
      sessionId,
      x,
      y,
      timestamp: new Date(),
    });

    return position;
  }

  /**
   * Finds the traveled path of the current active session.
   * @returns {Promise<{x: number; y: number; type: string;}[]>} The array of objects representing the traveled path, sorted by timestamp in ascending order.
   * @throws {NotFoundError} If no active mowing session exists.
   */
  public async findCurrentActiveSessionTraveledPath(): Promise<
    { x: number; y: number; type: string }[]
  > {
    const activeSession: Session | null =
      await this.sessionRepository.findActiveMowingSession();

    if (!activeSession) throw new NotFoundError('No active mowing session.');

    // Traveled path (Position & Obstacles) for current session, in ascending order.
    const path = await this.coordinateRepository.findAllWithFilter({
      where: {
        AND: [
          { sessionId: activeSession.id },
          {
            OR: [
              { type: CoordinateTypeEnum.POSITION },
              { type: CoordinateTypeEnum.OBSTACLE },
            ],
          },
        ],
      },
      orderBy: {
        timestamp: 'asc',
      },
      select: {
        x: true,
        y: true,
        type: true,
      },
    });

    return path as unknown as Promise<{ x: number; y: number; type: string }[]>;
  }
}
