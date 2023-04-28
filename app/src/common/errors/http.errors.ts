export class HttpError extends Error {
  public message: string;
  public statusCode: number;
  public timestamp: string;
  private errorCode?: string;

  constructor(message: string, statusCode: number, errorCode?: string) {
    super();
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.message = message;
    this.errorCode = errorCode;
    this.timestamp = new Date().toISOString();
  }

  public toJSON() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      errorCode: this.errorCode,
      timestamp: this.timestamp,
    };
  }
}

export class InternalServerError extends HttpError {
  constructor(message: string = 'An internal server error occurred.') {
    super(message, 500, 'INTERNAL_SERVER_ERROR');
    this.name = 'InternalServerError';
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string = 'The request is invalid.') {
    super(message, 400, 'BAD_REQUEST_ERROR');
    this.name = 'BadRequestError';
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = 'The requested resource could not be found.') {
    super(message, 404, 'RESOURCE_NOT_FOUND_ERROR');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends HttpError {
  constructor(
    message: string = 'The resource already exists in the system and cannot be created.',
    errorCode: string = 'CONFLICT_ERROR',
  ) {
    super(message, 409, errorCode);
    this.name = 'ConflictError';
  }
}
