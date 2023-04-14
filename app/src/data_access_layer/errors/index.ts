import {
  InternalServerError,
  ResourceAlreadyExistsError,
} from '../../common/errors';

export class DatabaseError extends InternalServerError {
  constructor(
    message: string = 'An unexpected error occurred while accessing the database.',
  ) {
    super(message);
  }
}

export class MowerAlreadyExistsError extends ResourceAlreadyExistsError {
  constructor(
    message: string = 'A mower with the specified serial number already exists in the system.',
  ) {
    super(message, 'MOWER_ALREADY_EXISTS');
  }
}
