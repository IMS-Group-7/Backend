import { NotFoundError } from '../../common/errors';
import {
  Coordinate,
  CoordinateRepository,
  Obstacle,
} from '../../data_access_layer/repositories';
import {
  ImageClassificationService,
  GoogleCloudStorageService,
} from '../../data_access_layer/services';
import { v4 as uuidv4 } from 'uuid';

export class ObstacleService {
  constructor(
    private coordinateRepository: CoordinateRepository,
    private imageClassificationService: ImageClassificationService,
    private fileStorageService: GoogleCloudStorageService,
  ) {}

  public async createObstacle(
    sessionId: string,
    x: number,
    y: number,
    fileBuffer: Buffer,
  ): Promise<{
    object: string;
  }> {
    const object: string = await this.imageClassificationService.classifyImage(
      fileBuffer,
    );

    const fileUrl = await this.fileStorageService.upload(uuidv4(), fileBuffer);

    const timestamp = new Date();
    await this.coordinateRepository.createObstacle(
      sessionId,
      x,
      y,
      timestamp,
      fileUrl,
      object,
    );

    return {
      object: object,
    };
  }

  public async findObstacleById(
    id: string,
  ): Promise<Obstacle & { coordinate: Coordinate }> {
    const obstacle: (Obstacle & { coordinate: Coordinate }) | null =
      await this.coordinateRepository.findObstacleById(id);

    if (!obstacle) throw new NotFoundError();

    return obstacle;
  }
}
