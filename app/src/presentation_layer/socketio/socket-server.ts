import { Socket, Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { BadRequestError, HttpError } from '../../common/errors';
import {
  DrivingModeEvent,
  EventType,
  PositionUpdateEvent,
  RegisterMowerEvent,
  SocketEvent,
  isValidSocketEvent,
} from './event.interfaces';

type Client = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

export class SocketServer {
  private io!: SocketIOServer;
  private mowerId?: string;

  constructor() {}

  public init(server: HttpServer): void {
    this.io = new SocketIOServer(server);

    this.io.on('connection', (client: Client) => {
      this.events(client);
      this.onMowerDisconnet(client);
    });
  }

  private events(client: Client): void {
    client.on('message', (data: any) => {
      this.validateSocketEvent(client, data);

      const event: SocketEvent = data as SocketEvent;

      // TODO: refactor this section
      // TODO: use BLL services where it makes sense

      if (event.type === EventType.REGISTER_MOWER) {
        this.mowerId = client.id;
        return;
      }

      if (event.type === EventType.POSITION_UPDATE) {
        // This client is also mowerId
        client.broadcast.emit('message', event);
        return;
      }

      if (event.type === EventType.DRIVING_MODE) {
        if (this.mowerId) client.to(this.mowerId).emit('message', event);
        else this.handleError(client, new HttpError('Mower is offline.', 503));
        return;
      }

      if (event.type === EventType.MOWER_COMMAND) {
        if (this.mowerId) client.to(this.mowerId).emit('message', event);
        else this.handleError(client, new HttpError('Mower is offline.', 503));
        return;
      }
    });
  }

  private validateSocketEvent(client: Client, data: any): void {
    if (!isValidSocketEvent(data))
      this.handleError(
        client,
        new BadRequestError(
          'Invalid message format, please check the documentation.',
        ),
      );
  }

  private handleError(client: Client, error: any): void {
    // Client must listen to the event "error" to be able to receive the error messages.
    if (error instanceof HttpError)
      this.io.to(client.id).emit('error', error.toJSON());
    return;
  }

  private onMowerDisconnet(client: Client): void {
    client.on('disconnect', () => {
      if (client.id === this.mowerId) this.mowerId = undefined;
    });
  }
}
