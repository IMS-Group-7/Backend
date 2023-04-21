import { RouterInterface } from '../router.interface';
import { NextFunction, Request, Response, Router } from 'express';
import { ObstacleService } from '../../../business_logic_layer/services/obstacle.service';
import multerMiddleware from '../middlewares/multer.middleware';

export class CoordinatesRouter implements RouterInterface {
  path: string;
  router: Router;

  constructor(private obstacleService: ObstacleService) {
    this.path = '/coordinates';
    this.router = Router();
    this.initRoutes();
  }

  initRoutes(): void {
    // Mower - Create a new position coordinate
    this.router.post(
      '/positions',
      async (req: Request, res: Response, next: NextFunction) => {
        const { sessionId, x, y } = req.body;
        try {
        } catch (error: unknown) {
          next(error);
        }
      },
    );

    // Mobile - Get the current position of the mower by its mower ID
    // URL: /coordinates/positions/current?mowerId=
    this.router.get(
      '/positions/current',
      async (req: Request, res: Response, next: NextFunction) => {
        const { mowerId } = req.query;
        try {
        } catch (error: unknown) {
          next(error);
        }
      },
    );

    // Mower - Create a new boundary coordinate
    this.router.post(
      '/boundaries',
      async (req: Request, res: Response, next: NextFunction) => {
        const { sessionId, x, y } = req.body;
        try {
        } catch (error: unknown) {
          next(error);
        }
      },
    );

    // Mobile - Fetch all boundary coordinates associated with a given mower
    // URL: /coordinates/boundaries?mowerId=
    this.router.get(
      '/boundaries',
      async (req: Request, res: Response, next: NextFunction) => {
        const { mowerId } = req.query;
        try {
        } catch (error: unknown) {
          next(error);
        }
      },
    );

    // Mower - Create a new obstacle coordinate (collision avoidance event)
    this.router.post(
      '/obstacles',
      multerMiddleware.single('image'),
      async (req: Request, res: Response, next: NextFunction) => {
        console.log(req.body);
        try {
          console.log(req.body);
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
    this.router.get(
      '/obstacles/:obstacleId',
      async (req: Request, res: Response, next: NextFunction) => {
        const { obstacleId } = req.params;
        try {
        } catch (error: unknown) {
          next(error);
        }
      },
    );
  }
}
