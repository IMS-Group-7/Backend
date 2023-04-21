export enum EventType {
  MOWER_REGISTRATION = 'MOWER_REGISTRATION',
  MOWER_COMMAND = 'MOWER_COMMAND',
  MOWER_POSITION = 'MOWER_POSITION',
  DRIVING_MODE = 'DRIVING_MODE',
}

export interface MowerRegistrationEvent {
  type: EventType.MOWER_REGISTRATION;
  data: {
    role: 'mower';
  };
}

export interface PositionUpdateEvent {
  type: EventType.MOWER_POSITION;
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
  | MowerRegistrationEvent
  | PositionUpdateEvent
  | DrivingModeEvent
  | MowerCommandEvent;

// validation function was generated with the help of chatGPT :)
export function isValidSocketEvent(event: any): event is SocketEvent {
  if (typeof event !== 'object' || event === null || !('data' in event)) {
    return false;
  }

  switch (event.type) {
    case EventType.MOWER_REGISTRATION:
      return (
        typeof event.data === 'object' &&
        event.data !== null &&
        event.data.role === 'mower'
      );
    case EventType.MOWER_POSITION:
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
