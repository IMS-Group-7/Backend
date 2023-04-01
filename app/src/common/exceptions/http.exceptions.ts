class HttpException extends Error {
  public message: string;
  public statusCode: number;
  public timestamp: string;
  public errorCodes?: string[];

  constructor(message: string, statusCode: number) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.timestamp = new Date().toISOString();
  }
}

class BadRequest extends HttpException {
  public errorCodes?: string[];

  constructor(message: string = 'Bad Request', errorCodes?: string[]) {
    super(message, 400);
    this.errorCodes = errorCodes;
  }
}

class NotFound extends HttpException {
  constructor(message: string = 'Resource Not Found') {
    super(message, 404);
  }
}

export { HttpException, BadRequest, NotFound };
