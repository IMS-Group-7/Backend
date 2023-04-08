import { NotFoundError } from '../../common/errors';
import { Mower, MowerRepository } from '../../data_access_layer/repositories';
import { MowerStatus } from '../mower-status.enum';

export class MowerService {
  constructor(private mowerRepository: MowerRepository) {}

  public async create(serial: string): Promise<Mower> {
    return this.mowerRepository.create(serial, MowerStatus.Stopped);
  }

  public async findBySerial(serial: string): Promise<Mower> {
    const mower: Mower | null = await this.mowerRepository.findBySerial(serial);

    if (!mower) throw new NotFoundError();
    return mower;
  }
}
