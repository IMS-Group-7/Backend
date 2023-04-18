import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';

export class SocketServer {
  private io!: SocketIOServer;

  constructor() {}

  init(server: HttpServer): SocketIOServer {
    this.io = new SocketIOServer(server);

    this.io.on('connection', (client: any) => {
      console.log('a client has connected.');
    });

    return this.io;
  }
}
