import { RouterInterface } from '../router.interface';
import { NextFunction, Request, Response, Router } from 'express';
import { ObstacleService } from '../../../business_logic_layer/services/obstacle.service';''
import multerMiddleware from '../middlewares/multer.middleware';
import { CoordinateService } from '../../../business_logic_layer/services/coordinate.service';
import { Obstacle } from '../../../data_access_layer/repositories';

export class CoordinatesRouter implements RouterInterface {
  path: string;
  router: Router;

  constructor(private obstacleService: ObstacleService, private coordinateService: CoordinateService) {
    this.path = '/coordinates';
    this.router = Router();
    this.initRoutes();
  }

  initRoutes(): void {
    // Mower - Create a new position coordinate
    // URL: /coordinates/positions
    this.router.post(
      '/positions',
      async (req: Request, res: Response, next: NextFunction) => {
        const { sessionId, x, y } = req.body;
        try {
          const createdCoordinate = this.coordinateService.createCoordinate(sessionId, x, y)
          res.status(201).json(createdCoordinate).end();
        } catch (error: unknown) {
          next(error);
        }
      },
    );

    // Mobile - Get the current position of the mower
    // URL: /coordinates/positions/current
    this.router.get(
      '/positions/current',
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const currentCoordinate = this.coordinateService.getCurrentPosition();
          res.status(200).json(currentCoordinate).end();
        } catch (error: unknown) {
          next(error);
        }
      },
    );

    // Mower - Create a new boundary coordinate
    // URL: /coordinates/boundaries
    this.router.post(
      '/boundaries',
      async (req: Request, res: Response, next: NextFunction) => {
        const { sessionId, x, y } = req.body;
        try {
          const createdCoordinate = this.coordinateService.createCoordinate(sessionId, x, y)
          res.status(201).json(createdCoordinate).end();
        } catch (error: unknown) {
          next(error);
        }
      },
    );

    // Mobile - Fetch all boundary coordinates
    // URL: /coordinates/boundaries
    this.router.get(
      '/boundaries',
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const coordinates = await this.coordinateService.findAllBoundaries();
          res.status(200).json(coordinates).end();

        } catch (error: unknown) {
          next(error);
        }
      },
    );

    // Mower - Create a new obstacle coordinate (collision avoidance event)
    // URL: /coordinates/obstacles
    this.router.post(
      '/obstacles',
      multerMiddleware.single('image'),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { sessionId, x, y } = req.body;
          const image = req.file; // Access the uploaded image file

          if (!image) {
            throw new Error('Image is required');
          }

          const imageName: string = image.originalname;
          // Convert image buffer to base64
          const base64Image = image.buffer.toString('base64');

          const classifiedImage = await this.obstacleService.createObstacle(
            sessionId,
            Number(x),
            Number(y),
            imageName,
            base64Image,
          );
          res.status(201).json(classifiedImage);
        } catch (error: unknown) {
          next(error);
        }
      },
    );

    // Mobile - Fetch a specific obstacle coordinate by its obstacle ID
    // URL: /coordinates/obstacles/:obstacleId
    this.router.get(
      '/obstacles/:obstacleId',
      async (req: Request, res: Response, next: NextFunction) => {
        const { obstacleId } = req.params;
        try {
          const obstacle: Obstacle = await this.obstacleService.findObstacleById(obstacleId);
          res.status(200).json(obstacle);

        } catch (error: unknown) {
          next(error);
        }
      },
    );
  }
}
