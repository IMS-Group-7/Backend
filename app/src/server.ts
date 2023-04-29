import express from 'express';
import cors from 'cors';
import { errorMiddleware } from './presentation_layer/api/middlewares';
import { Dependencies } from './dependencies';
import { Server as HttpServer, createServer } from 'http';

class Server {
  public port: number;
  private readonly dependencies: Dependencies;
  public expressApp: express.Application;
  private server: HttpServer;

  constructor(port: number, dependencies: Dependencies) {
    this.port = port;
    this.dependencies = dependencies;
    this.expressApp = express();
    this.server = createServer(this.expressApp);

    // initialize socketIO server
    this.dependencies.socketServer.init(this.server);

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
      }),
    );
    this.expressApp.use(cors({ origin: '*' }));
  }

  private initRouters(): void {
    this.expressApp.use(
      this.dependencies.pingRouter.path,
      this.dependencies.pingRouter.router,
    );
    this.expressApp.use(
      this.dependencies.sessionsRouter.path,
      this.dependencies.sessionsRouter.router,
    );
    this.expressApp.use(
      this.dependencies.coordinatesRouter.path,
      this.dependencies.coordinatesRouter.router,
    );
  }

  private initErrorHandling(): void {
    this.expressApp.use(errorMiddleware);
  }

  private async connectDatabase(): Promise<void> {
    await this.dependencies.databaseClient.$connect();
  }

  private async disconnectDatabaseBeforeExit(): Promise<void> {
    process.on('beforeExit', async () => {
      await this.dependencies.databaseClient.$disconnect();
    });
  }

  public listen(): void {
    this.server
      .listen(this.port, () => {
        console.log(`Listening on port ${this.port}`);
      })
      .on('error', (error) => {
        console.log(error);
      });
  }

  public close() {
    this.server.close();
  }
}

export default Server;
