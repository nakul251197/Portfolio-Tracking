import { Request, Response, Router } from 'express';
import tradesRouter from './tradesController';
import portfolioRouter from './portfolioController';

const routes = Router();

routes.use('/trades', tradesRouter);
routes.use('/portfolio', portfolioRouter);
routes.get('/', (request: Request, response: Response) => {
    response.status(200).json("Welcome to Portfolio-Tracker-Api!!");
  });

export default routes;