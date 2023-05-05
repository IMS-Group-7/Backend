export enum EventType {
  MOWER_REGISTRATION = 'MOWER_REGISTRATION',
  MOWER_COMMAND = 'MOWER_COMMAND',
  DRIVING_MODE = 'DRIVING_MODE',
}

export interface MowerRegistrationEvent {
  type: EventType.MOWER_REGISTRATION;
  data: {
    role: 'mower';
  };
}

export interface DrivingModeEvent {
  type: EventType.DRIVING_MODE;
  data: {
    mode: 'manual' | 'auto';
  };
}

enum MowerCommandAction {
  START = 'start',
  STOP = 'stop',
  FORWARD = 'forward',
  BACKWARD = 'backward',
  LEFT = 'left',
  RIGHT = 'right',
}

export interface MowerCommandEvent {
  type: EventType.MOWER_COMMAND;
  data: {
    action: MowerCommandAction;
  };
}

export type SocketEvent =
  | MowerRegistrationEvent
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
        'role' in event.data &&
        event.data.role === 'mower'
      );
    case EventType.DRIVING_MODE:
      return (
        typeof event.data === 'object' &&
        event.data !== null &&
        'mode' in event.data &&
        (event.data.mode === 'manual' || event.data.mode === 'auto')
      );
    case EventType.MOWER_COMMAND:
      return (
        typeof event.data === 'object' &&
        event.data !== null &&
        'action' in event.data &&
        Object.values(MowerCommandAction).includes(event.data.action)
      );
    default:
      return false;
  }
}
