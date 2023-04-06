import container from './container';
import { PrismaClient } from './data_access_layer/database-client';
import { PingRouter } from './presentation_layer/api/routers/ping.router';
import { MowersRouter } from './presentation_layer/api/routers/mowers.router';
import { SessionsRouter } from './presentation_layer/api/routers/sessions.router';
import { CollisionsRouter } from './presentation_layer/api/routers/collisions.router';

interface Dependencies {
  databaseClient: PrismaClient;
  // Routers
  pingRouter: PingRouter;
  mowersRouter: MowersRouter;
  sessionsRouter: SessionsRouter;
  collisionsRouter: CollisionsRouter;
}

const dependencies: Dependencies = {
  databaseClient: container.resolve<PrismaClient>('databaseClient'),
  pingRouter: container.resolve<PingRouter>('pingRouter'),
  mowersRouter: container.resolve<MowersRouter>('mowersRouter'),
  sessionsRouter: container.resolve<SessionsRouter>('sessionsRouter'),
  collisionsRouter: container.resolve<CollisionsRouter>('collisionsRouter'),
};

export { Dependencies, dependencies };
