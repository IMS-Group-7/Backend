import { RouterInterface } from '../router.interface';
import { NextFunction, Request, Response, Router } from 'express';
import { SessionService } from '../../../business_logic_layer/services';
import { BadRequestError } from '../../../common/errors';

export class SessionsRouter implements RouterInterface {
  path: string;
  router: Router;

  constructor(private sessionService: SessionService) {
    this.path = '/sessions';
    this.router = Router();
    this.initRoutes();
  }

  initRoutes(): void {
    // Mobile - Retrieve all mowing sessions
    // URL: /sessions
    this.router.get(
      '/',
      async (req: Request, res: Response, next: NextFunction) => {
          console.log("OKEJ1");
        try {
     
          const mowerSessions = await this.sessionService.findAll();

          res.status(200).json(mowerSessions).end();
        } catch (error: unknown) {
          next(error);
        }
      },
    );

    // Mobile - Get a specific mowing session by its ID
    this.router.get(
      '/:id',
      async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        console.log("OKEJ2");

        try {
          const sessionInDetail = await this.sessionService.findOneInDetailById(
            id,
          );

          res.status(200).json(sessionInDetail).end();
        } catch (error: unknown) {
          next(error);
        }
      },
    );

    // Mower - Start a new mowing session for a given mower ID
    this.router.post(
      '/start',
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const startedSession = await this.sessionService.start();
          res.status(201).json(startedSession).end();

        } catch (error: unknown) {
          next(error);
        }
      },
    );

    // Mower - Stop an ongoing mowing session by its ID
    this.router.post(
      '/stop',
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const stoppedSession = await this.sessionService.stop();

          res.status(200).json(stoppedSession).end();
        } catch (error: unknown) {
          next(error);
        }
      },
    );

   
  }
}
