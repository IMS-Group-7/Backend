import {
  createContainer,
  AwilixContainer,
  asClass,
  asValue,
  InjectionMode,
} from 'awilix';
import DatabaseClient from './data_access_layer/database-client';
import {
  MowerRepository,
  ObstacleRepository,
  SessionRepository,
} from './data_access_layer/repositories';
import { MowerService } from './business_logic_layer/services';
import { PingRouter } from './presentation_layer/api/routers/ping.router';
import { MowersRouter } from './presentation_layer/api/routers/mowers.router';
import { SessionsRouter } from './presentation_layer/api/routers/sessions.router';
import { CollisionsRouter } from './presentation_layer/api/routers/collisions.router';

const container: AwilixContainer = createContainer({
  injectionMode: InjectionMode.CLASSIC,
});

container.register({
  // DAL
  databaseClient: asValue(DatabaseClient.getInstance()),
  mowerRepository: asClass<MowerRepository>(MowerRepository).singleton(),
  sessionRepository: asClass<SessionRepository>(SessionRepository).singleton(),
  obstacleRepository:
    asClass<ObstacleRepository>(ObstacleRepository).singleton(),
  // BLL
  mowerService: asClass<MowerService>(MowerService).singleton(),
  // PL
  pingRouter: asClass<PingRouter>(PingRouter).singleton(),
  mowersRouter: asClass<MowersRouter>(MowersRouter).singleton(),
  sessionsRouter: asClass<SessionsRouter>(SessionsRouter).singleton(),
  collisionsRouter: asClass<CollisionsRouter>(CollisionsRouter).singleton(),
});

export default container;
