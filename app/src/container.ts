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
import { SessionService } from './business_logic_layer/services';
import {
  ImageClassificationService,
  FileStorageService,
  GoogleCloudFileStorageService,
  LocalFileStorageService,
} from './data_access_layer/services/';
import { PingRouter } from './presentation_layer/api/routers/ping.router';
import { SessionsRouter } from './presentation_layer/api/routers/sessions.router';
import { CoordinatesRouter } from './presentation_layer/api/routers/coordinates.router';
import { ObstacleService } from './business_logic_layer/services/obstacle.service';
import { CoordinateService } from './business_logic_layer/services/coordinate.service';

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
  fileStorageService: asClass<FileStorageService>(
    GoogleCloudFileStorageService,
  ).singleton(),

  // BLL
  sessionService: asClass<SessionService>(SessionService).singleton(),
  obstacleService: asClass<ObstacleService>(ObstacleService).singleton(),
  coordinateService: asClass<CoordinateService>(CoordinateService).singleton(),

  // PL
  pingRouter: asClass<PingRouter>(PingRouter).singleton(),
  sessionsRouter: asClass<SessionsRouter>(SessionsRouter).singleton(),
  coordinatesRouter: asClass<CoordinatesRouter>(CoordinatesRouter).singleton(),
});

export default container;
