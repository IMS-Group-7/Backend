interface RegisterMowerEvent {
  type: 'register_mower';
  data: {
    role: 'mower';
  };
}

interface PositionUpdateEvent {
  type: 'position_update';
  data: {
    x: number;
    y: number;
    sessionId: string;
  };
}

interface DrivingModeEvent {
  type: 'driving_mode';
  data: {
    mode: 'manual' | 'auto';
  };
}

enum MowerControlDirection {
  FORWARD = 'forward',
  BACKWARD = 'backward',
  LEFT = 'left',
  RIGHT = 'right',
}

interface MowerCommandEvent {
  type: 'mower_control';
  data: {
    direction: MowerControlDirection;
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
    case 'register_mower':
      return (
        typeof event.data === 'object' &&
        event.data !== null &&
        event.data.role === 'mower'
      );
    case 'position_update':
      return (
        typeof event.data === 'object' &&
        event.data !== null &&
        'x' in event.data &&
        'y' in event.data &&
        'sessionId' in event.data
      );
    case 'driving_mode':
      return (
        typeof event.data === 'object' &&
        event.data !== null &&
        (event.data.mode === 'manual' || event.data.mode === 'auto')
      );
    case 'mower_control':
      return (
        typeof event.data === 'object' &&
        event.data !== null &&
        'direction' in event.data &&
        Object.values(MowerControlDirection).includes(event.data.direction)
      );
    default:
      return false;
  }
}
