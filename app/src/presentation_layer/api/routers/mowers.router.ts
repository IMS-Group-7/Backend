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

     /**
     * Fetch all mowing sessions for a specific mower by its serial number
     */
     this.router.get(
      '/:serial/sessions',
      async (req: Request, res: Response, next: NextFunction) => {
        const { serial } = req.params;
        res.status(200).json(
          [{
            sessionId: "123abc",
            mowerSerial: "1zA321",
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
          },
          {
            sessionId: "124abc",
            mowerSerial: "1zA321",
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
          },
          {
            sessionId: "125abc",
            mowerSerial: "1zA321",
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
          }]
        )
      },
    );
    
    /**
     * Fetch entire boundaries for all stored mowing sessions 
     * (full map will be generated the more the mower runs)
     */
    this.router.get(
      '/:serial/maps',
      async (req: Request, res: Response, next: NextFunction) => {
        const { serial } = req.params;
          res.status(200).json(
            [
              {x: 10, y: 10}, 
              {x: 11, y: 11}, 
              {x: 12, y: 1}
            ],
          )
      },
    );
  }
}
