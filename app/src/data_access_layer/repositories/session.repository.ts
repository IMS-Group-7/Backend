import {
  Coordinate,
  Obstacle,
  Prisma,
  PrismaClient,
  Session,
} from '@prisma/client';
import { DatabaseError } from '../errors';
import { MowerStatus } from '../mower-status.enum';
import { CoordinateType } from '../coordinate.type';
import { x } from 'joi';
export { Session };

export class SessionRepository {
  constructor(private databaseClient: PrismaClient) {}

  /**
   * Starts a new session for the specified mower.
   *
   * @param mowerId The ID of the mower.
   * @param startTime The start time of the session.
   * @returns The created session.
   * @throws DatabaseError if there is any error during the operation.
   */
  public async startByMowerId(
    mowerId: string,
    startTime: Date,
  ): Promise<Session> {
    try {
      const result: Session = await this.databaseClient.$transaction(
        async (tx) => {
          const session: Session = await tx.session.create({
            data: {
              mowerId,
              startTime,
            },
          });

          await tx.mower.update({
            data: {
              status: MowerStatus.Mowing,
            },
            where: {
              id: mowerId,
            },
          });

          return session;
        },
      );

      return result;
    } catch (error: unknown) {
      console.log(error);
      throw new DatabaseError();
    }
  }

  /**
   * Stops an ongoing session by setting its end time.
   *
   * @param id The ID of the session to be stopped.
   * @param endTime The end time of the session.
   * @returns The updated session with the end time or null if session with the specified ID does not exist.
   * @throws DatabaseError if there is any other error during the operation.
   */
  public async stopById(id: string, endTime: Date): Promise<Session | null> {
    try {
      const result: Session = await this.databaseClient.$transaction(
        async (tx) => {
          const session: Session = await tx.session.update({
            data: {
              endTime,
            },
            where: {
              id,
            },
          });

          await tx.mower.update({
            data: {
              status: MowerStatus.Stopped,
            },
            where: {
              id: session.mowerId,
            },
          });

          return session;
        },
      );

      return result;
    } catch (error: unknown) {
      console.log(error);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      )
        return null;
      throw new DatabaseError();
    }
  }

  /**
   * Finds a session by its ID.
   *
   * @param id The ID of the session to be fetched.
   * @returns The session with the specified ID or null if not found.
   * @throws DatabaseError if there is any error during the operation.
   */
  public async findById(id: string): Promise<Session | null> {
    try {
      const session: Session | null =
        await this.databaseClient.session.findUnique({
          where: {
            id,
          },
        });
      return session;
    } catch (error) {
      console.log(error);
      throw new DatabaseError();
    }
  }

  /**
   * Finds a session by its ID and includes its obstacles.
   *
   * @param id The ID of the session to be fetched.
   * @returns The session with its associated coordinates and obstacles.
   * @throws DatabaseError if there is any error during the operation.
   */
  public async findOneWithObstaclesById(id: string): Promise<
    | (Session & {
        coordinate: (Coordinate & {
          obstacle: Obstacle | null;
        })[];
      })
    | null
  > {
    try {
      const session = await this.databaseClient.session.findUnique({
        where: {
          id,
        },
        include: {
          coordinate: {
            include: {
              obstacle: true,
            },
            where: {
              obstacle: {
                isNot: null,
              },
            },
          },
        },
      });
      return session;
    } catch (error: unknown) {
      console.log(error);
      throw new DatabaseError();
    }
  }

  /**
   * Finds all sessions by a given mower ID.
   *
   * @param mowerId The ID of the mower.
   * @returns An array of sessions associated with the mower.
   * @throws DatabaseError if there is any error during the operation.
   */
  public async findAllByMowerId(mowerId: string): Promise<Session[]> {
    try {
      const sessions: Session[] = await this.databaseClient.session.findMany({
        where: {
          mowerId,
        },
      });
      return sessions;
    } catch (error: unknown) {
      console.log(error);
      throw new DatabaseError();
    }
  }
}
