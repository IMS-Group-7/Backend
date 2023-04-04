import express from 'express';
import cors from 'cors';
import { errorMiddleware } from './api/middlewares';
import { config } from '../common/config';
import { pingRouter } from './api/routers/ping.router';
import { collisionsRouter } from './api/routers/collisions.router';
class App {
  public expressApp: express.Application;
  public port: number;

  constructor(port: number) {
    this.expressApp = express();
    this.port = port;

    this.initMiddlewares();
    this.initRouters();
    this.initErrorHandling();
  }

  private initMiddlewares(): void {
    this.expressApp.use(express.json());
    this.expressApp.use(
      express.urlencoded({
        extended: false,
        limit: config.MAXIMUM_REQUEST_BODY_SIZE,
      }),
    );
    this.expressApp.use(cors({ origin: '*' }));
  }

  private initRouters(): void {
    this.expressApp.use(pingRouter.path, pingRouter.router);
    this.expressApp.use(collisionsRouter.path, collisionsRouter.router);
  }

  private initErrorHandling(): void {
    this.expressApp.use(errorMiddleware);
  }

  public listen(): void {
    this.expressApp
      .listen(this.port, () => {
        console.log(`Listening on port ${this.port}`);
      })
      .on('error', (error) => {
        console.log(error);
      });
  }
}

export const app = new App(config.PORT);
