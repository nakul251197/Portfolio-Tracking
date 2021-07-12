import { NextFunction, Request, Response } from 'express';
import { logger } from '../util/logger';
import HttpException from './HttpException';
 
function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  const type = error.type || 'GeneralException';
  logger.error(`${request.originalUrl} - ${request.method} - ${request.ip} - ${status} - ${type} - ${message}`);
  response.status(status).send({type: type, message: message});
}
 
export default errorMiddleware;