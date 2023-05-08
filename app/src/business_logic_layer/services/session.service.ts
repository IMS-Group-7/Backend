import { BadRequestError, NotFoundError } from '../../common/errors';
import {
  Session,
  SessionRepository,
  SessionWithObstacles,
} from '../../data_access_layer/repositories';

export class SessionService {
  constructor(private sessionRepository: SessionRepository) {}

  /**
   * Starts a new mowing session and saves it in the database.
   *
   * @returns {Promise<Session>} The newly created session.
   * @throws {BadRequestError} If an active mowing session already exists.
   */
  public async start(): Promise<Session> {
    const activeSession =
      await this.sessionRepository.findActiveMowingSession();

    if (activeSession)
      throw new BadRequestError(`A mowing session is already active`);

    const session: Session = await this.sessionRepository.create({
      startTime: new Date(),
      endTime: null,
    });

    return session;
  }

  /**
   * Stops the current mowing session and updates its end time in the database.
   *
   * @returns {Promise<Session>} The updated session with the end time.
   * @throws {NotFoundError} If there is no active mowing session.
   */
  public async stop(): Promise<Session> {
    const activeSession =
      await this.sessionRepository.findActiveMowingSession();

    if (!activeSession) throw new NotFoundError('No active session found');

    const stoppedSession = await this.sessionRepository.updateById(
      activeSession.id,
      {
        endTime: new Date(),
      },
    );

    return stoppedSession;
  }

  /**
   * Finds all the saved mowing sessions in the database.
   *
   * @returns {Promise<Session[]>} An array of all the saved sessions.
   */
  public async findAll(): Promise<Session[]> {
    const sessions: Session[] = await this.sessionRepository.findAll();
    return sessions;
  }

  /**
   * Finds a session with obstacles by the given ID.
   *
   * @param {string} id - The ID of the session to search for.
   * @returns {Promise<Object>} An object that contains the session and its obstacle events with the total number of obstacles.
   * @throws {NotFoundError} If the session with the given ID is not found.
   */
  public async findOneWithObstaclesById(id: string): Promise<Object> {
    const session: SessionWithObstacles =
      await this.sessionRepository.findOneWithObstaclesById(id);

    if (!session) throw new NotFoundError(`Session with ID "${id}" not found`);

    const obstacleCount: number = session.coordinate.length;

    return { ...session, obstacleCount };
  }
}
