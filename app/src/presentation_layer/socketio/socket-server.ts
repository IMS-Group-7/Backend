import { Socket, Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { BadRequestError, HttpError } from '../../common/errors';
import {
  DrivingModeEvent,
  EventType,
  PositionUpdateEvent,
  MowerRegistrationEvent,
  SocketEvent,
  isValidSocketEvent,
} from './event.interfaces';

type Client = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

export class SocketServer {
  private io!: SocketIOServer;
  private mowerId?: string;

  constructor() {}

  /**
   * Initializes the Socket.IO server.
   *
   * @param server The HTTP server instance.
   */
  public init(server: HttpServer): void {
    this.io = new SocketIOServer(server);

    this.io.on('connection', (client: Client) => {
      this.events(client);
      this.onMowerDisconnet(client);
    });
  }

  /**
   * Registers event handlers for incoming socket messages.
   *
   * @param client The socket client instance.
   */
  private events(client: Client): void {
    client.on('message', (data: any) => {
      const eventData: SocketEvent | undefined =
        this.parseAndvalidateMessageData(client, data);

      if (!eventData) return;

      // TODO: refactor this section
      // TODO: use BLL services where it makes sense

      if (eventData.type === EventType.MOWER_REGISTRATION) {
        this.mowerId = client.id;
        return;
      }

      if (eventData.type === EventType.MOWER_POSITION) {
        client.broadcast.emit('message', JSON.stringify(eventData));
        return;
      }

      if (eventData.type === EventType.DRIVING_MODE) {
        if (this.mowerId)
          client.to(this.mowerId).emit('message', JSON.stringify(eventData));
        else this.handleError(client, new HttpError('Mower is offline.', 503));
        return;
      }

      if (eventData.type === EventType.MOWER_COMMAND) {
        if (this.mowerId)
          client.to(this.mowerId).emit('message', JSON.stringify(eventData));
        else this.handleError(client, new HttpError('Mower is offline.', 503));
        return;
      }
    });
  }

  /**
   * Parses and validates incoming message data.
   *
   * @param client The socket client instance.
   * @param data The raw message data.
   * @returns The parsed and validated SocketEvent, or undefined if the message data is invalid.
   */
  private parseAndvalidateMessageData(
    client: Client,
    data: any,
  ): SocketEvent | undefined {
    try {
      const parsedData = JSON.parse(data);

      if (!isValidSocketEvent(parsedData)) {
        throw new BadRequestError('Invalid message format');
      }

      return parsedData as SocketEvent;
    } catch (error: unknown) {
      if (error instanceof SyntaxError) {
        this.handleError(
          client,
          new BadRequestError(
            'Invalid message format due to syntax error. Ensure that the JSON data is properly stringified.',
          ),
        );
      } else this.handleError(client, error);
    }
  }

  /**
   * Handles errors that occur during socket communication.
   *
   * @param client The socket client instance.
   * @param error The error object.
   */
  private handleError(client: Client, error: HttpError | unknown): void {
    if (error instanceof HttpError) {
      this.io.to(client.id).emit('error', JSON.stringify(error.toJSON()));
    } else {
      const unknownError = new HttpError(
        error instanceof Error ? error.message : 'Unknown error',
        500,
      );
      this.io
        .to(client.id)
        .emit('error', JSON.stringify(unknownError.toJSON()));
    }
  }

  /**
   * Handles disconnect events for the mower client.
   *
   * @param client The socket client instance.
   */
  private onMowerDisconnet(client: Client): void {
    client.on('disconnect', () => {
      if (client.id === this.mowerId) this.mowerId = undefined;
    });
  }
}
