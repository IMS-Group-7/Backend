import { RouterInterface } from '../router.interface';
import { Request, Response, Router } from 'express';

export class PingRouter implements RouterInterface {
  path: string;
  router: Router;

  constructor() {
    this.path = '/';
    this.router = Router();
    this.initRoutes();
  }

  initRoutes(): void {
    // Endpoint to check the network connection to the backend
    this.router.get('/ping', (_: Request, res: Response) => {
      res.status(200).send('pong').end();
    });
  }
}
