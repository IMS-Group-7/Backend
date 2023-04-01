import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../../../common/exceptions';

export function errorMiddleware(
  error: HttpException | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof HttpException) {
    res
      .status(error.statusCode)
      .send({
        statusCode: error.statusCode,
        message: error.message,
        errorCodes: error.errorCodes,
        timestamp: error.timestamp,
      })
      .end();
  } else {
    res
      .status(500)
      .send({
        statusCode: 500,
        message: error.message,
        timestamp: new Date().toISOString(),
      })
      .end();
  }
}
