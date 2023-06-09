import { RouterInterface } from '../router.interface';
import { NextFunction, Request, Response, Router } from 'express';
import multerMiddleware from '../middlewares/multer.middleware';
import { BadRequestError } from '../../../common/errors';
import {
  BoundaryService,
  ObstacleService,
  PositionService,
} from '../../../business_logic_layer/services';
import { isNumber } from '../helpers';

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
        const { x, y } = req.body;
        try {
          if (!isNumber(x) || !isNumber(y))
            throw new BadRequestError(
              "Invalid input format: 'x' and 'y' must be valid numbers.",
            );

          const createdCoordinate = await this.positionService.add(
            Number(x),
            Number(y),
          );
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
        const { x, y } = req.body;
        try {
          if (!isNumber(x) || !isNumber(y))
            throw new BadRequestError(
              "Invalid input format: 'x' and 'y' must be valid numbers.",
            );

          const createdCoordinate = await this.boundaryService.add(
            Number(x),
            Number(y),
          );
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
            await this.positionService.findCurrentActiveSessionTraveledPath();
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
        const fileBuffer: Buffer | undefined = req.file?.buffer;
        const { x, y } = req.body;
        try {
          if (!isNumber(x) || !isNumber(y) || !fileBuffer)
            throw new BadRequestError(
              "Invalid input format: 'x' and 'y' must be valid numbers, and 'image' is required.",
            );

          const classifiedImage = await this.obstacleService.add(
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
        const { obstacleId: id } = req.params;
        try {
          const obstacle = await this.obstacleService.findById(id);
          res.status(200).json(obstacle);
        } catch (error: unknown) {
          next(error);
        }
      },
    );
  }
}
