import { Request, Response, NextFunction } from 'express';

export class CustomError {
  constructor(public message: string, public status: number = 500, public additionalInfo: any = {}) {}
}

export function errorHandler(
  err: TypeError | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof CustomError) {
    res.status(err.status).send(err);
  } else {
    const newError = new CustomError(err.message);
    res.status(newError.status).send(newError);
  }
}
