import Server from './server';
import { config } from './common/config';
import { dependencies } from './dependencies';

const server = new Server(config.PORT, dependencies);
server.listen();
