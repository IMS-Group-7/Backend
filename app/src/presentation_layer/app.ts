import express from 'express';
import cors from 'cors';
import router from './api/routers';
import { errorMiddleware } from './api/middlewares';
import { config } from '../common/config';

class App {
  public app: express.Application;
  public port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;

    this.initMiddlewares();
    this.initControllers();
    this.initErrorHandling();
  }

  private initMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(
      express.urlencoded({
        extended: false,
        limit: config.MAXIMUM_REQUEST_BODY_SIZE,
      }),
    );
    this.app.use(cors({ origin: '*' }));
  }

  private initControllers(): void {
    this.app.use(router);
    this.app.use('/api', router);
  }

  private initErrorHandling(): void {
    this.app.use(errorMiddleware);
  }

  public listen(): void {
    this.app
      .listen(this.port, () => {
        console.log(`Listening on port ${this.port}`);
      })
      .on('error', (error) => {
        console.log(error);
      });
  }
}

export const app = new App(config.PORT);
