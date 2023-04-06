import { Request, Response } from 'express';
import AbstractRouter from './abstract-router';

class CollisionsRouter extends AbstractRouter {
  constructor() {
    super('/collisions');
  }

  protected initRoutes(): void {
    /**
     * Fetch all collision avoidance events
     * URL: /collisions/obstacles?sessionId=
     */
    this.router.get('/obstacles', (req: Request, res: Response) => {
      const { sessionId } = req.query;
    });

    /**
     * Fetch one collision avoidance event by id
     */
    this.router.get('/obstacles/:id', (req: Request, res: Response) => {
      const { id } = req.params;
    });

    /**
     * Send a collision avoidance event
     */
    this.router.post('/obstacles', (req: Request, res: Response) => {
      const { sessionId, x, y, file } = req.body;
    });

    /**
     * Fetch all stored boundary coordinates
     * URL: /collisions/boundaries?serial=
     */
    this.router.get('/boundaries/', (req: Request, res: Response) => {
      const { serial } = req.query;
    });

    /**
     * Mower sends a request when running over the boundary
     */
    this.router.post('/boundaries', (req: Request, res: Response) => {
      const { sessionId, x, y } = req.body;
    });
  }
}

export const collisionsRouter = new CollisionsRouter();
