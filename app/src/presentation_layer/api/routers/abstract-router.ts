import { Router } from 'express';

abstract class AbstractRouter {
  public path: string;
  public router: Router = Router();

  constructor(path: string) {
    this.path = path;
    this.initRoutes();
  }

  protected initRoutes(): void {}
}

export default AbstractRouter;
