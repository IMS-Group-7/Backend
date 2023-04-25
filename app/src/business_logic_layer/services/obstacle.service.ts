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

  /**
   * Adds a new obstacle coordinate with associated image classification data in the database.
   *
   * @param {string} sessionId - The ID of the session.
   * @param {number} x - The x coordinate.
   * @param {number} y - The y coordinate.
   * @param {Buffer} fileBuffer - A buffer containing the image data.
   * @returns {Promise<{ object: string }>} - An object containing the classification data for the obstacle.
   */
  public async add(
    sessionId: string,
    x: number,
    y: number,
    fileBuffer: Buffer,
  ): Promise<{ object: string }> {
    const object: string = await this.imageClassificationService.classifyImage(
      fileBuffer,
    );

    const fileUrl = await this.fileStorageService.upload(uuidv4(), fileBuffer);

    await this.coordinateRepository.addObstacle(
      {
        sessionId,
        x,
        y,
        timestamp: new Date(),
      },
      fileUrl,
      object,
    );

    return {
      object: object,
    };
  }

  /**
   * Finds an Obstacle by its ID and returns it along with its associated Coordinate.
   * @param {string} id - The ID of the Obstacle to retrieve.
   * @returns {Promise<Obstacle & { coordinate: Coordinate }>} The Obstacle object and its associated Coordinate object.
   * @throws {NotFoundError} If no Obstacle with the specified ID is found.
   */
  public async findById(
    id: string,
  ): Promise<Obstacle & { coordinate: Coordinate }> {
    const obstacle: (Obstacle & { coordinate: Coordinate }) | null =
      await this.coordinateRepository.findObstacleById(id);

    if (!obstacle) throw new NotFoundError(`Obstacle with ID ${id} not found.`);

    return obstacle;
  }
}
