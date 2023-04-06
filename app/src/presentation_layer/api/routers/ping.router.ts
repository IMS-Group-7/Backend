import { Request, Response } from 'express';
import AbstractRouter from './abstract-router';

class PingRouter extends AbstractRouter {
  constructor() {
    super('/');
  }

  protected initRoutes(): void {
    /**
     * An endpoint to check the network connection to the backend
     */
    this.router.get('/ping', (_: Request, res: Response) => {
      res.status(200).send('pong').end();
    });
  }
}

export const pingRouter = new PingRouter();
