import { ResourceAlreadyExistsError } from '../../common/errors';

export class MowerAlreadyExists extends ResourceAlreadyExistsError {
  constructor(
    message: string = 'A mower with the specified serial number already exists in the system.',
  ) {
    super(message, 'MOWER_ALREADY_EXISTS');
  }
}
