import { NotFoundError } from '../../common/errors';
import { MowerStatus } from '../../data_access_layer/mower-status.enum';
import { Mower, MowerRepository } from '../../data_access_layer/repositories';

export class MowerService {
  constructor(private mowerRepository: MowerRepository) {}

  public async registerBySerial(serial: string): Promise<Mower> {
    // TODO: input validation
    console.log("SERIAL IS NOW ",   serial);
    console.log("SERIAL IS NOW TYPE ",  typeof serial);
    const registeredMower: Mower = await this.mowerRepository.create(
      serial,
      MowerStatus.Stopped,
    );

    return registeredMower;
  }

  public async findBySerial(serial: string): Promise<Mower> {
    // TODO: input validation

    const mower: Mower | null = await this.mowerRepository.findBySerial(serial);

    if (!mower)
      throw new NotFoundError(`Mower with serial ${serial} not found`);

    return mower;
  }
}
