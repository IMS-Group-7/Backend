import container from './container';
import { PrismaClient } from './data_access_layer/database-client';
import { PingRouter } from './presentation_layer/api/routers/ping.router';
import { MowersRouter } from './presentation_layer/api/routers/mowers.router';
import { SessionsRouter } from './presentation_layer/api/routers/sessions.router';
import { CoordinatesRouter } from './presentation_layer/api/routers/coordinates.router';

// instances in BLL and DAL will be resolved and injected automatically by Awilix when required by other components

interface Dependencies {
  databaseClient: PrismaClient;
  pingRouter: PingRouter;
  mowersRouter: MowersRouter;
  sessionsRouter: SessionsRouter;
  coordinatesRouter: CoordinatesRouter;
}

const dependencies: Dependencies = {
  databaseClient: container.resolve<PrismaClient>('databaseClient'),
  pingRouter: container.resolve<PingRouter>('pingRouter'),
  mowersRouter: container.resolve<MowersRouter>('mowersRouter'),
  sessionsRouter: container.resolve<SessionsRouter>('sessionsRouter'),
  coordinatesRouter: container.resolve<CoordinatesRouter>('coordinatesRouter'),
};

export { Dependencies, dependencies };
