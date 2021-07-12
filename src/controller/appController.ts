import { Router } from 'express';
import tradesRouter from './tradesController';
import portfolioRouter from './portfolioController';

const routes = Router();

routes.use('/trades', tradesRouter);
routes.use('/portfolio', portfolioRouter);

export default routes;