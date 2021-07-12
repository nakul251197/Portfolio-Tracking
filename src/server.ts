import express from 'express';
import routes from './controller/appController';
import errorMiddleware from './exception/errorMiddleware';
import { logger } from './util/logger';
import config from './config/appConfig.json'

const port = process.env.PORT || config.port;
const app = express();  
app.use(express.json());
app.use(routes);
app.use(errorMiddleware);
app.use(function (req, res, next) {
  res.status(404).send({type: "NotFound", "message": "Route Not Found"});
  logger.error(`400 || ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
})
app.listen(port, () => {
  logger.info(`Server started at port ${port}...`);
  console.log(`Server started on port ${port}...`);
});
