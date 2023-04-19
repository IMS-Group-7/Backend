export enum EventType {
  REGISTER_MOWER = 'register_mower',
  POSITION_UPDATE = 'position_update',
  DRIVING_MODE = 'driving_mode',
  MOWER_COMMAND = 'mower_command',
}

export interface RegisterMowerEvent {
  type: EventType.REGISTER_MOWER;
  data: {
    role: 'mower';
  };
}

export interface PositionUpdateEvent {
  type: EventType.POSITION_UPDATE;
  data: {
    x: number;
    y: number;
    sessionId: string;
  };
}

export interface DrivingModeEvent {
  type: EventType.DRIVING_MODE;
  data: {
    mode: 'manual' | 'auto';
  };
}

enum MowerCommandDirection {
  FORWARD = 'forward',
  BACKWARD = 'backward',
  LEFT = 'left',
  RIGHT = 'right',
}

export interface MowerCommandEvent {
  type: EventType.MOWER_COMMAND;
  data: {
    direction: MowerCommandDirection;
  };
}

export type SocketEvent =
  | RegisterMowerEvent
  | PositionUpdateEvent
  | DrivingModeEvent
  | MowerCommandEvent;

// validation function was generated with the help of chatGPT :)
export function isValidSocketEvent(event: any): event is SocketEvent {
  if (typeof event !== 'object' || event === null || !('data' in event)) {
    return false;
  }

  switch (event.type) {
    case EventType.REGISTER_MOWER:
      return (
        typeof event.data === 'object' &&
        event.data !== null &&
        event.data.role === 'mower'
      );
    case EventType.POSITION_UPDATE:
      return (
        typeof event.data === 'object' &&
        event.data !== null &&
        'x' in event.data &&
        'y' in event.data &&
        'sessionId' in event.data
      );
    case EventType.DRIVING_MODE:
      return (
        typeof event.data === 'object' &&
        event.data !== null &&
        (event.data.mode === 'manual' || event.data.mode === 'auto')
      );
    case EventType.MOWER_COMMAND:
      return (
        typeof event.data === 'object' &&
        event.data !== null &&
        'direction' in event.data &&
        Object.values(MowerCommandDirection).includes(event.data.direction)
      );
    default:
      return false;
  }
}
