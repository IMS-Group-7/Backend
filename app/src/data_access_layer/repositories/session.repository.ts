import { Coordinate, Obstacle, PrismaClient, Session } from '@prisma/client';
import { DatabaseError } from '../errors';
export { Session };

export type SessionWithObstacles =
  | (Session & {
      coordinate: (Coordinate & {
        obstacle: Obstacle | null;
      })[];
    })
  | null;

export class SessionRepository {
  constructor(private databaseClient: PrismaClient) {}

  /**
   * Creates a new session in the database.
   *
   * @param {Omit<Session, 'id'>} data - An object containing the required properties for the new session, except for the auto-generated 'id'.
   * @returns {Promise<Session>} The created session.
   * @throws {DatabaseError} If there's an error during the creation process.
   */
  public async create(data: Omit<Session, 'id'>): Promise<Session> {
    try {
      const result: Session = await this.databaseClient.session.create({
        data,
      });
      return result;
    } catch (error: unknown) {
      console.log(error);
      throw new DatabaseError();
    }
  }

  /**
   * Updates a session by its ID.
   *
   * @param {string} id - The ID of the session to update.
   * @param {Partial<Session>} data - An object containing the fields to update.
   * @returns {Promise<Session>} The updated session.
   * @throws {DatabaseError} If there's an error during the update process.
   */
  public async updateById(
    id: string,
    data: Partial<Session>,
  ): Promise<Session> {
    try {
      const session: Session = await this.databaseClient.session.update({
        data,
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
   * Retrieves the active mowing session from the database.
   *
   * @returns {Promise<Session | null>} The active Session object, or null if no active session is found.
   * @throws {DatabaseError} If there's an error during the retrieval process.
   */
  public async findActiveMowingSession(): Promise<Session | null> {
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

  /**
   * Retrieves all sessions.
   *
   * @returns {Promise<Session[]>} A promise that resolves with an array of Session objects.
   * @throws {DatabaseError} If there's an error during the retrieval process.
   */
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
   * Retrieves a session by ID
   *
   * @param {string} id - The ID of the session to be fetched.
   * @returns {Promise<Session | null>} A session object, or null if no session is found.
   * @throws {DatabaseError} If there's an error during the retrieval process.
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
   * @param {string} id - The ID of the session to be fetched.
   * @returns The session with its associated coordinates and obstacles.
   * @throws DatabaseError if there is any error during the operation.
   */
  public async findOneWithObstaclesById(
    id: string,
  ): Promise<SessionWithObstacles> {
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
            orderBy: {
              timestamp: 'desc',
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
