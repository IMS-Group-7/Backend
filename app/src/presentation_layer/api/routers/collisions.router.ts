import { Request, Response } from 'express';
import AbstractRouter from './abstract-router';

export class CollisionsRouter extends AbstractRouter {
  constructor() {
    super('/collisions');
  }

  protected initRoutes(): void {

    /**
     * Fetch one collision avoidance event by id
     */
    this.router.get('/obstacles/:id', (req: Request, res: Response) => {
      const { id } = req.params;
      res.status(200).json({
        sessionId: "1DcaxzcsxSD", x: 1, y: 1, object: "a plant", imagePath: "http://imgur.com/1", timestamp: new Date().toISOString() 
      })
    });

    /**
     * Send a collision avoidance event
     */
    this.router.post('/obstacles', (req: Request, res: Response) => {
      const { sessionId, x, y, file } = req.body;
      res.status(200).json({
        object: "a Cat"
      })
    });
  }
}
