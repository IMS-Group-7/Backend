import { Socket, Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { BadRequestError, HttpError } from '../../common/errors';
import { isValidSocketEvent } from './event.interfaces';

type Client = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

export class SocketServer {
  private io!: SocketIOServer;
  private mowerId?: string;

  constructor() {}

  public init(server: HttpServer): void {
    this.io = new SocketIOServer(server);

    this.io.on('connection', (client: Client) => {
      this.events(client);
    });
  }

  private events(client: Client): void {
    client.on('message', (data: any) => {
      this.validateSocketEvent(data);
    });
  }

  private validateSocketEvent(data: any): void {
    if (!isValidSocketEvent(data))
      this.handleError(
        new BadRequestError(
          'Invalid message format, please check the documentation.',
        ),
      );
  }

  private handleError(error: any): void {
    // Client must listen to the event "error" to be able to receive the error messages.
    if (error instanceof HttpError) this.io.emit('error', error.toJSON());
  }
}
