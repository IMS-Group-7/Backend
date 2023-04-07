import { Request, Response } from 'express';
import AbstractRouter from './abstract-router';

export class SessionsRouter extends AbstractRouter {
  constructor() {
    super('/sessions');
  }

  protected initRoutes(): void {
    /**
     * Mower sends a request when a mowing session begins
     */
    this.router.post('/start', (req: Request, res: Response) => {
      const { serial } = req.body;
    });

    /**
     * Mower sends a request when a mowing session ends
     */
    this.router.post('/stop', (req: Request, res: Response) => {
      const { serial, sessionId } = req.body;
    });

    /**
     * Fetch all mowing sessions for a specific mower by its serial number
     * URL: /sessions?serial=
     */
    this.router.get('/', (req: Request, res: Response) => {
      const { serial } = req.query;
    });

    /**
     * Fetch session by id, including postions, boundaries and obstacles
     */
    this.router.get('/:id', (req: Request, res: Response) => {
      const { id } = req.params;
    });

    /**
     * Mower sends its position every 3 seconds or so
     */
    this.router.post('/:id/positions', (req: Request, res: Response) => {
      const { id } = req.params; // id is sessionId
      const { sessionId, x, y } = req.body;
    });
  }
}
