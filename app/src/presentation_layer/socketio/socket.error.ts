import { ErrorEvent, EventType, SocketErrorCode } from './event.interfaces';

export class SocketError extends Error {
  public code: SocketErrorCode;

  constructor(code: SocketErrorCode) {
    super();
    this.code = code;
  }

  public toJSON(): ErrorEvent {
    return {
      type: EventType.ERROR,
      data: {
        code: this.code,
      },
    };
  }
}
