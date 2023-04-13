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
    /**
     * Mower sends a request when a mowing session begins
     */
    this.router.put(
      '/start',
      async (req: Request, res: Response, next: NextFunction) => {
        const { mowerId } = req.body;
        try {
          const startedSession = await this.sessionService.startByMowerId(
            mowerId,
          );

          res.status(201).json(startedSession).end();
        } catch (error: unknown) {
          next(error);
        }
      },
    );

    /**
     * Mower sends a request when a mowing session ends
     */
    this.router.put(
      '/stop',
      async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.body;
        try {
          const stoppedSession = await this.sessionService.stopById(id);

          return res.status(200).json(stoppedSession).end();
        } catch (error: unknown) {
          next(error);
        }
      },
    );

    /**
     * Get all mowing sessions that belong to a specific mower by mower ID
     * URL: /sessions?mowerId=
     */
    this.router.get(
      '/',
      async (req: Request, res: Response, next: NextFunction) => {
        const { mowerId } = req.query;

        try {
          if (typeof mowerId !== 'string')
            throw new BadRequestError(
              "Query param 'mowerId' must be of type string",
            );

          const mowerSessions = await this.sessionService.findAllByMowerId(
            mowerId,
          );

          return res.status(200).json(mowerSessions).end();
        } catch (error: unknown) {
          next(error);
        }
      },
    );

    /**
     * Get one session by id, including postions, boundaries and obstacles
     */
    this.router.get(
      '/:id',
      async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        try {
          const sessionInDetail = await this.sessionService.findOneInDetailById(
            id,
          );

          return res.status(200).json(sessionInDetail).end();
        } catch (error: unknown) {
          next(error);
        }
      },
    );
  }
}
