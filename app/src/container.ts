import { createContainer, AwilixContainer, asClass, asValue } from 'awilix';
import DatabaseClient from './data_access_layer/database-client';
import { PingRouter } from './presentation_layer/api/routers/ping.router';
import { MowersRouter } from './presentation_layer/api/routers/mowers.router';
import { SessionsRouter } from './presentation_layer/api/routers/sessions.router';
import { CollisionsRouter } from './presentation_layer/api/routers/collisions.router';

const container: AwilixContainer = createContainer();

container.register({
  databaseClient: asValue(DatabaseClient.getInstance()),
  // Routers
  pingRouter: asClass<PingRouter>(PingRouter).singleton(),
  mowersRouter: asClass<MowersRouter>(MowersRouter).singleton(),
  sessionsRouter: asClass<SessionsRouter>(SessionsRouter).singleton(),
  collisionsRouter: asClass<CollisionsRouter>(CollisionsRouter).singleton(),
});

export default container;
