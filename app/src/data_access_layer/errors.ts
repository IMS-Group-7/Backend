import { InternalServerError } from '../common/errors';

export class DatabaseError extends InternalServerError {
  constructor(
    message: string = 'An unexpected error occurred while accessing the database.',
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}
