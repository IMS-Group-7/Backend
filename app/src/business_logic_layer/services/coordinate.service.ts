import { Coordinate } from '@prisma/client';
import {
  CoordinateRepository,
  SessionRepository,
} from '../../data_access_layer/repositories';
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from '../../common/errors';

export class CoordinateService {
  constructor(
    private coordinateRepository: CoordinateRepository,
    private sessionRepository: SessionRepository,
  ) {}

  public async createCoordinate(
    sessionId: string,
    x: number,
    y: number,
  ): Promise<Coordinate> {
    try {
      const timestamp = new Date();
      const coordinate: Coordinate =
        await this.coordinateRepository.createPosition(
          sessionId,
          x,
          y,
          timestamp,
        );
      if (!coordinate) throw new InternalServerError('Coordinate not created');

      return coordinate;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  public async createBoundary(
    sessionId: string,
    x: number,
    y: number,
  ): Promise<Coordinate> {
    try {
      const timestamp = new Date();
      const boundary: Coordinate =
        await this.coordinateRepository.createBoundary(
          sessionId,
          x,
          y,
          timestamp,
        );
      if (!boundary) throw new InternalServerError('Boundary not created');

      return boundary;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  public async getCurrentPosition(): Promise<Coordinate> {
    try {
      if (!this.sessionRepository.findActiveMowingSession())
        throw new NotFoundError('No active mower session found');

      const currentPosition: Coordinate | null =
        await this.coordinateRepository.getCurrentPosition();
      if (currentPosition === null) {
        throw new NotFoundError('Current position not found');
      }
      return currentPosition;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  public async findAllBoundariesBySessionId(
    sessionId: string,
  ): Promise<Coordinate[]> {
    try {
      const boundaries: Coordinate[] =
        await this.coordinateRepository.findAllBoundariesBySessionId(sessionId);
      if (!boundaries) throw new NotFoundError('Boundaries not found');

      return boundaries;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  public async findAllBoundaries(): Promise<Coordinate[]> {
    try {
      const boundaries: Coordinate[] =
        await this.coordinateRepository.findAllBoundaries();
      if (!boundaries) throw new NotFoundError('Boundaries not found');

      return boundaries;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
