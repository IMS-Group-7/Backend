import { BadRequestError, NotFoundError } from '../../common/errors';
import {
  Session,
  SessionRepository,
} from '../../data_access_layer/repositories';

export class SessionService {
  constructor(private sessionRepository: SessionRepository) {}

  public async start(): Promise<Session> {
    const activeSession =
      await this.sessionRepository.findActiveMowingSession();

    if (activeSession)
      throw new BadRequestError(`A mowing session is already active.`);

    const session: Session = await this.sessionRepository.create({
      startTime: new Date(),
      endTime: null,
    });

    return session;
  }

  public async stop(): Promise<Session> {
    const activeSession =
      await this.sessionRepository.findActiveMowingSession();

    if (!activeSession)
      throw new NotFoundError('There is no active mowing session.');

    const stoppedSession = await this.sessionRepository.updateById(
      activeSession.id,
      {
        endTime: new Date(),
      },
    );

    return stoppedSession;
  }

  public async findAll(): Promise<Session[]> {
    const sessions: Session[] = await this.sessionRepository.findAll();
    return sessions;
  }

  public async findOneInDetailById(id: string) {
    const session = await this.sessionRepository.findOneWithObstaclesById(id);
    if (!session) throw new NotFoundError(`Session with ID ${id} not found`);

    const totalObstacles: number = session.coordinate.length;

    return { ...session, totalObstacles };
  }
}
