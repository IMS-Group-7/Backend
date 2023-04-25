import { RouterInterface } from '../router.interface';
import { NextFunction, Request, Response, Router } from 'express';
import multerMiddleware from '../middlewares/multer.middleware';
import { BadRequestError } from '../../../common/errors';
import {
  BoundaryService,
  ObstacleService,
  PositionService,
} from '../../../business_logic_layer/services';

export class CoordinatesRouter implements RouterInterface {
  path: string;
  router: Router;

  constructor(
    private boundaryService: BoundaryService,
    private obstacleService: ObstacleService,
    private positionService: PositionService,
  ) {
    this.path = '/coordinates';
    this.router = Router();
    this.initRoutes();
  }

  initRoutes(): void {
    // Mower - Add a new position coordinate
    this.router.post(
      '/positions',
      async (req: Request, res: Response, next: NextFunction) => {
        const { sessionId, x, y } = req.body;
        try {
          const createdCoordinate = this.positionService.add(sessionId, x, y);
          res.status(201).json(createdCoordinate).end();
        } catch (error: unknown) {
          next(error);
        }
      },
    );

    // Mower - Add a new boundary coordinate
    this.router.post(
      '/boundaries',
      async (req: Request, res: Response, next: NextFunction) => {
        const { sessionId, x, y } = req.body;
        try {
          const createdCoordinate = this.boundaryService.add(sessionId, x, y);
          res.status(201).json(createdCoordinate).end();
        } catch (error: unknown) {
          next(error);
        }
      },
    );

    // Mobile - Fetch travled path of the current active session
    this.router.get(
      '/active-session-path',
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const activeSessionPath =
            await this.positionService.findCurrentActiveSessionTravelledPath();

          res.status(200).json(activeSessionPath).end();
        } catch (error: unknown) {
          next(error);
        }
      },
    );

    // Mobile - Fetch all boundary coordinates (with no repetition)
    this.router.get(
      '/boundaries',
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const coordinates = await this.boundaryService.findAllDistinct();
          res.status(200).json(coordinates).end();
        } catch (error: unknown) {
          next(error);
        }
      },
    );

    // Mower - Add a new obstacle coordinate (collision avoidance event)
    this.router.post(
      '/obstacles',
      multerMiddleware.single('image'),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { sessionId, x, y } = req.body;
          const fileBuffer = req.file?.buffer;

          if (!fileBuffer)
            throw new BadRequestError("Field 'image' is required");

          const classifiedImage = await this.obstacleService.add(
            sessionId,
            Number(x),
            Number(y),
            fileBuffer,
          );

          res.status(201).json(classifiedImage).end();
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
          const obstacle = await this.obstacleService.findById(obstacleId);
          res.status(200).json(obstacle);
        } catch (error: unknown) {
          next(error);
        }
      },
    );
  }
}
