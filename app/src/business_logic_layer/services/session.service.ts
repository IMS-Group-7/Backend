import { BadRequestError, NotFoundError } from '../../common/errors';
import { MowerStatus } from '../../data_access_layer/mower-status.enum';
import {
  Coordinate,
  Mower,
  MowerRepository,
  Obstacle,
  Session,
  SessionRepository,
} from '../../data_access_layer/repositories';

export class SessionService {
  constructor(
    private sessionRepository: SessionRepository,
    private mowerRepository: MowerRepository,
  ) {}

  public async startByMowerId(mowerId: string): Promise<Session> {
    // TODO: input validation

    const mower: Mower | null = await this.mowerRepository.findById(mowerId);
    if (!mower) throw new NotFoundError(`Mower with ID ${mowerId} not found`);

    if (mower.status === MowerStatus.Mowing)
      throw new BadRequestError(
        `The mower with ID ${mowerId} is already mowing`,
      );

    const startTime: Date = new Date();
    const startedSession = await this.sessionRepository.startByMowerId(
      mowerId,
      startTime,
    );

    return startedSession;
  }

  public async stopById(id: string): Promise<Session> {
    // TODO: input validation

    const session = await this.sessionRepository.findById(id);
    if (!session) throw new NotFoundError(`Session with ID ${id} not found`);

    if (session.endTime)
      throw new BadRequestError(
        `The mowing session with ID ${id} has already ended`,
      );

    const endTime: Date = new Date();
    const stoppedsession = (await this.sessionRepository.stopById(
      id,
      endTime,
    )) as Session;

    return stoppedsession;
  }

  public async findAllByMowerId(mowerId: string): Promise<Session[]> {
    // TODO: input validation

    const mower: Mower | null = await this.mowerRepository.findById(mowerId);
    if (!mower) throw new NotFoundError(`Mower with ID ${mowerId} not found`);

    const sessions: Session[] = await this.sessionRepository.findAllByMowerId(
      mowerId,
    );

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
