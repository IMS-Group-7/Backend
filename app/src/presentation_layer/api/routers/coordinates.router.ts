import { RouterInterface } from '../router.interface';
import { NextFunction, Request, Response, Router } from 'express';

export class CoordinatesRouter implements RouterInterface {
  path: string;
  router: Router;

  constructor() {
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
      async (req: Request, res: Response, next: NextFunction) => {
        const { sessionId, x, y, image } = req.body;
        try {
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
