export class HttpError extends Error {
  public message: string;
  public statusCode: number;
  public timestamp: string;
  private errorCode?: string;
  private errorCodes?: string[];

  constructor(message: string, statusCode: number, errorCode?: string);
  constructor(message: string, statusCode: number, errorCodes?: string[]);
  constructor(message: string, statusCode: number, error?: string | string[]) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.timestamp = new Date().toISOString();

    if (typeof error === 'string') this.errorCode = error;
    else if (Array.isArray(error)) this.errorCodes = error;
  }

  public toJSON() {
    const error = this.errorCode
      ? { errorCode: this.errorCode }
      : { errorCodes: this.errorCodes };
    return {
      statusCode: this.statusCode,
      message: this.message,
      ...error,
      timestamp: this.timestamp,
    };
  }
}

export class InternalServerError extends HttpError {
  constructor(message: string = 'An internal server error occurred.') {
    super(message, 500, 'INTERNAL_SERVER_ERROR');
  }
}

export class BadRequestError extends HttpError {
  constructor(
    message: string = 'The request is invalid.',
    errorCodes?: string[],
  ) {
    super(message, 400, errorCodes);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = 'The requested resource could not be found.') {
    super(message, 404, 'RESOURCE_NOT_FOUND');
  }
}

export class ResourceAlreadyExistsError extends HttpError {
  constructor(
    message: string = 'The resource already exists in the system and cannot be created.',
    errorCode: string = 'RESOURCE_ALREADY_EXISTS',
  ) {
    super(message, 409, errorCode);
  }
}
