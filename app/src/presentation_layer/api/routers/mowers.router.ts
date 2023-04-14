import { RouterInterface } from '../router.interface';
import { NextFunction, Request, Response, Router } from 'express';
import { MowerService } from '../../../business_logic_layer/services';

export class MowersRouter implements RouterInterface {
  path: string;
  router: Router;

  constructor(private mowerService: MowerService) {
    this.path = '/mowers';
    this.router = Router();
    this.initRoutes();
  }

  initRoutes(): void {
    // Mobile - Register a mower by its serial number
    this.router.post(
      '/',
      async (req: Request, res: Response, next: NextFunction) => {
        const { serial } = req.body;

        try {
          const mower = await this.mowerService.registerBySerial(serial);
          res.status(201).json(mower).end();
        } catch (error: unknown) {
          next(error);
        }
      },
    );

    // Mobile / Mower - Retrieve mower information by its serial number
    this.router.get(
      '/:serial',
      async (req: Request, res: Response, next: NextFunction) => {
        const { serial } = req.params;

        try {
          const mower = await this.mowerService.findBySerial(serial);
          res.status(200).json(mower).end();
        } catch (error: unknown) {
          next(error);
        }
      },
    );
  }
}
