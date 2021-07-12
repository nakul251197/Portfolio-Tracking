import { Request, Response, Router } from 'express';
import { PortfolioService } from '../service/portfolioService';

const portfolioRouter = Router();

portfolioRouter.get("/", async (request: Request, response: Response) => {
  let portfolio = await PortfolioService.getPortfolio();
  response.status(200).json(portfolio);
});

portfolioRouter.get("/returns", async (request: Request, response: Response) => {
  let returns = await PortfolioService.getReturns();
  response.status(200).json({return: returns});
});

export default portfolioRouter;