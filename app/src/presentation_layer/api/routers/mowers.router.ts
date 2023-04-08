import { NextFunction, Request, Response } from 'express';
import AbstractRouter from './abstract-router';
import { MowerService } from '../../../business_logic_layer/services';

export class MowersRouter extends AbstractRouter {
  constructor(private mowerService: MowerService) {
    super('/mowers');
  }

  protected initRoutes(): void {
    /**
     * Fetch mower information by serial number
     */
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

    /**
     * Register a mower using serial its serial number
     */
    this.router.post(
      '/',
      async (req: Request, res: Response, next: NextFunction) => {
        const { serial } = req.body;

        try {
          const mower = await this.mowerService.create(serial);
          res.status(201).json(mower).end();
        } catch (error: unknown) {
          next(error);
        }
      },
    );
  }
}
