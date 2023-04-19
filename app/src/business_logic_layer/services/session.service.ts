import { BadRequestError, NotFoundError } from '../../common/errors';
import { MowerStatus } from '../../data_access_layer/mower-status.enum';
import {
  Coordinate,
  Obstacle,
  Session,
  SessionRepository,
} from '../../data_access_layer/repositories';

export class SessionService {
  constructor(
    private sessionRepository: SessionRepository,
  ) {}

  public async start(): Promise<Session> {
    // TODO: input validation

    const activeSession = await this.sessionRepository.findActiveMower();
    if (activeSession) throw new NotFoundError(`The session is already active`);

    // if (mower.status === MowerStatus.Mowing)
    //   throw new BadRequestError(
    //     `The mower with ID ${mowerId} is already mowing`,
    //   );

    const startTime: Date = new Date();
    const startedSession = await this.sessionRepository.start(
      startTime
    );

    return startedSession;
  }

  public async stop(): Promise<Session> {
    // TODO: input validation

    const session = await this.sessionRepository.findActiveMower();
    if (!session) throw new NotFoundError(`There are no sessions running`);

    // if (session.endTime)
    //   throw new BadRequestError(
    //     `The mowing session with ID ${id} has already ended`,
    //   );

    const endTime: Date = new Date();
    const stoppedSession = (await this.sessionRepository.stop(
      endTime,
    )) as Session;

    return stoppedSession;
  }

  public async findAll(): Promise<Session[]> {
    const sessions: Session[] = await this.sessionRepository.findAll();
    return sessions;
  }

  public async findOneInDetailById(id: string) {
    // TODO: input validation

    const session = await this.sessionRepository.findOneWithObstaclesById(id);
    if (!session) throw new NotFoundError(`Session with ID ${id} not found`);

    const totalObstacles: number = session.coordinate.length;

    return { ...session, totalObstacles };
  }
}
