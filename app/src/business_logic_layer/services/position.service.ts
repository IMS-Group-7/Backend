import { Coordinate } from '@prisma/client';
import {
  CoordinateRepository,
  SessionRepository,
  Session,
} from '../../data_access_layer/repositories';
import { BadRequestError, NotFoundError } from '../../common/errors';

export class PositionService {
  constructor(
    private coordinateRepository: CoordinateRepository,
    private sessionRepository: SessionRepository,
  ) {}

  /**
   * Adds a new position coordinate to the database.
   * @param {number} x - The x coordinate of the new position.
   * @param {number} y - The y coordinate of the new position.
   * @returns {Promise<Coordinate>} The new position coordinate object.
   * @throws {BadRequestError} If there is no active mowing session.
   */
  public async add(x: number, y: number): Promise<Coordinate> {
    const activeSession: Session | null =
      await this.sessionRepository.findActiveMowingSession();

    if (!activeSession) throw new BadRequestError('No active session found');

    const position: Coordinate = await this.coordinateRepository.addPosition({
      sessionId: activeSession.id,
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

    if (!activeSession) throw new NotFoundError('No active session found');

    // Traveled path (Position & Obstacles) for current session, in ascending order.
    const path = await this.coordinateRepository.findAllWithFilter({
      where: {
        sessionId: activeSession.id,
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
