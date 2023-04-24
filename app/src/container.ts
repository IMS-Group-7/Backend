import {
  createContainer,
  AwilixContainer,
  asClass,
  asValue,
  InjectionMode,
} from 'awilix';
import DatabaseClient from './data_access_layer/database-client';
import {
  CoordinateRepository,
  SessionRepository,
} from './data_access_layer/repositories';
import {
  ImageClassificationService,
  GoogleCloudStorageService,
} from './data_access_layer/services';
import {
  SessionService,
  ObstacleService,
  CoordinateService,
} from './business_logic_layer/services';
import { PingRouter } from './presentation_layer/api/routers/ping.router';
import { SessionsRouter } from './presentation_layer/api/routers/sessions.router';
import { CoordinatesRouter } from './presentation_layer/api/routers/coordinates.router';
import { SocketServer } from './presentation_layer/socketio/socket-server';

const container: AwilixContainer = createContainer({
  injectionMode: InjectionMode.CLASSIC,
});

container.register({
  // DAL
  databaseClient: asValue(DatabaseClient.getInstance()),
  sessionRepository: asClass<SessionRepository>(SessionRepository).singleton(),
  coordinateRepository:
    asClass<CoordinateRepository>(CoordinateRepository).singleton(),

  imageClassificationService: asClass<ImageClassificationService>(
    ImageClassificationService,
  ).singleton(),
  fileStorageService: asClass<GoogleCloudStorageService>(
    GoogleCloudStorageService,
  ).singleton(),

  // BLL
  sessionService: asClass<SessionService>(SessionService).singleton(),
  obstacleService: asClass<ObstacleService>(ObstacleService).singleton(),
  coordinateService: asClass<CoordinateService>(CoordinateService).singleton(),

  // PL
  pingRouter: asClass<PingRouter>(PingRouter).singleton(),
  sessionsRouter: asClass<SessionsRouter>(SessionsRouter).singleton(),
  coordinatesRouter: asClass<CoordinatesRouter>(CoordinatesRouter).singleton(),
  socketServer: asClass<SocketServer>(SocketServer).singleton(),
});

export default container;
