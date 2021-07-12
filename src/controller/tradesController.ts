import { NextFunction, Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';
import { nextTick } from 'process';
import { TradesService } from '../service/tradesService';
import { getErrorResponse } from '../util/utils';

const tradesRouter = Router();

tradesRouter.post("/", async (request: Request, response: Response, next: NextFunction) => {
  try {
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
      let errorResponse = getErrorResponse(errors.array());
      return response.status(422).json(errorResponse);
    }
    let trade: any = await TradesService.createTrade(request.body);
    return response.status(201).json(trade);
  } catch(error) {
    next(error);
  }
});

tradesRouter.put("/:id", async (request: Request, response: Response, next: NextFunction) => {
  try {
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
      let errorResponse = getErrorResponse(errors.array());
      return response.status(422).json(errorResponse);
    }
    let trade: any = await TradesService.updateTrade(+request.params.id, request.body);
    return response.status(201).json(trade);
  } catch(error) {
    next(error);
  }
});

tradesRouter.delete("/:id", async (request: Request, response: Response) => {
  let trade = await TradesService.removeTrade(+request.params.id);
  return response.status(200).json(trade);
});

tradesRouter.get("/", async (request: Request, response: Response) => {
  let trades = await TradesService.getTrades();
  return response.status(200).json(trades);
});

tradesRouter.get("/")

export default tradesRouter;