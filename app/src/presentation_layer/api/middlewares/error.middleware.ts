import { Request, Response, NextFunction } from 'express';
import { HttpError, InternalServerError } from '../../../common/errors';

export function errorMiddleware(
  error: HttpError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof HttpError) {
    res.status(error.statusCode).json(error.toJSON()).end();
  } else {
    console.log(error);
    const unexpectedError = new InternalServerError();
    res.status(unexpectedError.statusCode).send(unexpectedError.toJSON()).end();
  }
}
