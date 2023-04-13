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

    const timestamp = new Date();
    const startedSession = this.sessionRepository.startByMowerId(
      mowerId,
      timestamp,
    );

    return startedSession;
  }

  public async stopById(id: string): Promise<Session> {
    // TODO: input validation

    const session = await this.sessionRepository.findById(id);
    if (!session) throw new NotFoundError();

    if (session.endTime)
      throw new BadRequestError(
        `The mowing session with ID ${id} has already ended`,
      );

    const endTime = new Date();
    const stoppedSesston = (await this.sessionRepository.stopById(
      id,
      endTime,
    )) as Session;

    return stoppedSesston;
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

  public async findOneInDetailById(id: string): Promise<
    Session & {
      coordinate: (Coordinate & {
        obstacle: Obstacle | null;
      })[];
    }
  > {
    // TODO: input validation

    const session = await this.sessionRepository.findOneInDetailById(id);
    if (!session) throw new NotFoundError(`Session with ID ${id} not found`);

    // I think its better to let the client filter the coordinate array :)
    return session;
  }
}
