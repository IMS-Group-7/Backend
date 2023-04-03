import express from 'express';
import cors from 'cors';
import router from './api/routers';
import { errorMiddleware } from './api/middlewares';
import { config } from '../common/config';

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
    this.expressApp.use(router);
    this.expressApp.use('/api', router);
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
