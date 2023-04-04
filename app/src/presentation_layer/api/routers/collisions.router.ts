import { Request, Response } from 'express';
import AbstractRouter from './abstract-router';

class CollisionsRouter extends AbstractRouter {
  constructor() {
    super('/collisions');
  }

  protected initRoutes(): void {
    /**
     * Fetch all collision avoidance events
     */
    this.router.get('/objects', (req: Request, res: Response) => {});

    /**
     * Fetch one collision avoidance event by id
     */
    this.router.get('/objects/:id', (req: Request, res: Response) => {});

    /**
     * Send a collision avoidance event
     */
    this.router.put('/objects', (req: Request, res: Response) => {});

    /**
     * Fetch all stored boundary coordinates
     */
    this.router.get('/boundaries', (req: Request, res: Response) => {});
  }
}

export const collisionsRouter = new CollisionsRouter();
