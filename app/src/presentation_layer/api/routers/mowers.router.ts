import { Request, Response } from 'express';
import AbstractRouter from './abstract-router';

export class MowersRouter extends AbstractRouter {
  constructor() {
    super('/mowers');
  }

  protected initRoutes(): void {
    /**
     * Fetch mower information by serial number
     */
    this.router.get('/:serial', (req: Request, res: Response) => {
      const { serial } = req.params;
    });

    /**
     * Register a mower using serial its serial number
     */
    this.router.post('/', (req: Request, res: Response) => {
      const { serial } = req.body;
    });
  }
}
