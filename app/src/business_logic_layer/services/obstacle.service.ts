import { Coordinate, CoordinateRepository, Obstacle } from "../../data_access_layer/repositories";
import { ImageClassificationService, FileStorageService } from "../../data_access_layer/services";

export class ObstacleService {
    constructor(
        private coordinateRepository: CoordinateRepository, 
        private imageClassificationService: ImageClassificationService,
        private fileStorageService: FileStorageService
        ) {}
        
        
        public async createObstacle(sessionId: string, x: number, y: number, fileName: string, base64Image: string): Promise<string> {
            try {
                const timestamp = new Date();
                const classifiedImage = await this.imageClassificationService.getClassifiedImage(base64Image);
                const fileUrl = await this.fileStorageService.createFile(fileName, base64Image);
                await this.coordinateRepository.createObstacle(sessionId, x, y, timestamp, fileUrl, classifiedImage);        
                return classifiedImage;

              } catch (err) {
                console.error(err);
                throw err;
            }
        }

        public async findObstacleById(id: string): Promise<(Obstacle & { coordinate: Coordinate })> {
            try {
              const obstacle: (Obstacle & { coordinate: Coordinate }) | null = await this.coordinateRepository.findObstacleById(id);
                if (obstacle === null) {
                    throw new Error("Obstacle not found");
                }

              return obstacle;
          
            } catch (err) {
              console.error(err);
              throw err;
            }
          }
}




    

