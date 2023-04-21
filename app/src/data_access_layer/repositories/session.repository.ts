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
  public async start(
    startTime: Date,
  ): Promise<Session> {
    try {

      const result: Session = await this.databaseClient.session.create({
        data: {
          startTime,
        },
      });
      // const result: Session = await this.databaseClient.$transaction(
      //   async (tx) => {
      //     const session: Session = await tx.session.create({
      //       data: {
      //         startTime,
      //       },
      //     });

      //     await tx.mower.update({
      //       data: {
      //         status: MowerStatus.Mowing,
      //       },
      //       where: {
      //         id: mowerId,
      //       },
      //     });

      //     return session;
      //   },
      // );

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
  public async stop(endTime: Date): Promise<Session | null> {
    try {
      const sessionToUpdate: Session | null = await this.databaseClient.session.findFirst({
        where: {
          endTime: null,
        },
      });

      if (!sessionToUpdate) throw new DatabaseError("Session doesn't exist");

      const updatedSession: Session = await this.databaseClient.session.update({
        data: {
          endTime: endTime,
        },
        where: {
          id: sessionToUpdate.id,
        },
      });

      return updatedSession;
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
  public async findActiveMower(): Promise<Session | null> {
    try {
      const session: Session | null =
        await this.databaseClient.session.findFirst({
          where: {
            endTime: null,
          },
        });
      return session;
    } catch (error) {
      console.log(error);
      throw new DatabaseError();
    }
  }

  public async findAll(): Promise<Session[]> {
    try {
      const sessions: Session[] = await this.databaseClient.session.findMany();
      
      return sessions;
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
}
