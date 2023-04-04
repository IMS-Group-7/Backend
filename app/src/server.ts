import express from 'express';
import cors from 'cors';
import { config } from './common/config';
import { prismaConnect, prismaDisconnect } from './data_access_layer/prisma';
import { errorMiddleware } from './presentation_layer/api/middlewares';
import { collisionsRouter } from './presentation_layer/api/routers/collisions.router';
import { pingRouter } from './presentation_layer/api/routers/ping.router';

class Server {
  public expressApp: express.Application;
  public port: number;

  constructor() {
    this.expressApp = express();
    this.port = config.PORT;

    this.connectDatabase();
    this.initMiddlewares();
    this.initRouters();
    this.initErrorHandling();
    this.disconnectDatabaseBeforeExit();
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

  private async connectDatabase(): Promise<void> {
    await prismaConnect();
  }

  private async disconnectDatabaseBeforeExit(): Promise<void> {
    process.on('beforeExit', async () => {
      await prismaDisconnect();
    });
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

export default Server;
