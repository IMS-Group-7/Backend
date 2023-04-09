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
      res.status(201).json({
        sessionId: "123abc"
      });
    });

    /**
     * Mower sends a request when a mowing session ends
     */
    this.router.post('/stop', (req: Request, res: Response) => {
      const { serial, sessionId } = req.body;
      res.status(201).json({
        sessionId: "123abc",
        mowerId: "1zA321",
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
      });
    });

    /**
     * Fetch session by id, including postions, boundaries and obstacles
     */
    this.router.get('/:id', (req: Request, res: Response) => {
      const { id } = req.params;
      const now = new Date().toISOString();
      res.status(200).json({
        session: {
          sessionId: "123abc",
          mowerSerial: "1zA321",
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
        },
        boundaries: [
                      {x: 1, y: 1}, 
                      {x: 1, y: 2}, 
                      {x: 1, y: 3}, 
                      {x: 2, y: 1}, 
                      {x: 3, y: 1}, 
                      {x: 4, y: 2}
                    ],
        positions: [
                    {x: 10, y: 10}, 
                    {x: 11, y: 11}, 
                    {x: 12, y: 1}
                  ],
        obstacles: [
                    {sessionId: "1DcaxzcsxSD", x: 1, y: 1, object: "a plant", imagePath: "http://imgur.com/1", timestamp: now }, 
                    {sessionId: "1DcaxzcsxSD", x: 1, y: 1, object: "a shoe", imagePath: "http://imgur.com/2", timestamp: now }, 
                    {sessionId: "1DcaxzcsxSD", x: 1, y: 3, object: "a stone", imagePath: "http://imgur.com/3", timestamp: now }, 
                    {sessionId: "1DcaxzcsxSD", x: 1, y: 4, object: "a dog", imagePath: "http://imgur.com/4", timestamp: now }
                  ],
      })
    });

    /**
     * Mower sends its position every 3 seconds or so
     */
    this.router.post('/:id/positions', (req: Request, res: Response) => {
      const { id } = req.params; // id is sessionId
      const { sessionId, x, y } = req.body;

      res.status(201).json({
        id: "jAjdKKk1C3km34kl45",
        sessionId: "JDjkdKSdkdkd777zDS8x8x",
        x: 7,
        y: 8,
      })
    });

    /**
     * Mower sends a request when running over the boundary
     */
    this.router.post('/:id/boundaries', (req: Request, res: Response) => {
      const { id } = req.params; // id is sessionId
      const { sessionId, x, y } = req.body;

      res.status(201).json({
        id: "jAjdKKk1C3km34kl45",
        sessionId: "JDjkdKSdkdkd777zDS8x8x",
        x: 7,
        y: 8,
      })
    });
  }
}
