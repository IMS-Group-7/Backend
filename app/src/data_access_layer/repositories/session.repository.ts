import { Coordinate, Obstacle, PrismaClient, Session } from '@prisma/client';
import { DatabaseError } from '../errors';
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
  public async start(mowerId: string, startTime: Date): Promise<Session> {
    try {
      const session: Session = await this.databaseClient.session.create({
        data: {
          mowerId,
          startTime,
        },
      });
      return session;
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
   * @returns The updated session with the end time.
   * @throws DatabaseError if there is any error during the operation.
   */
  public async stop(id: string, endTime: Date): Promise<Session> {
    try {
      const session: Session = await this.databaseClient.session.update({
        data: {
          endTime,
        },
        where: {
          id,
        },
      });
      return session;
    } catch (error: unknown) {
      console.log(error);
      throw new DatabaseError();
    }
  }

  /**
   * Checks if a given mower has an ongoing session.
   *
   * @param mowerId The ID of the mower.
   * @returns A boolean indicating whether the mower has an ongoing session.
   * @throws DatabaseError if there is any error during the operation.
   */
  public async hasOngoingSession(mowerId: string): Promise<boolean> {
    try {
      const session: Session | null =
        await this.databaseClient.session.findFirst({
          where: {
            mowerId,
            endTime: null,
          },
        });

      return session !== null;
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

  /**
   * Finds a session by its ID and includes its associated coordinates and obstacles.
   *
   * @param id The ID of the session to be fetched.
   * @returns The session with its associated coordinates and obstacles.
   * @throws DatabaseError if there is any error during the operation.
   */
  public async findSessionInDetailById(id: string): Promise<
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
            orderBy: {
              timestamp: 'asc',
            },
            include: {
              obstacle: true,
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
