import { config } from './common/config';
import Server from './server';

const server = new Server(config.PORT);
server.listen();
