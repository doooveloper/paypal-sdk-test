import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { checkoutRouter, subscriptionRouter, viewRouter } from './routers';

(async () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  app.use(express.static(`${__dirname}/views`));
  app.use('/checkout', checkoutRouter);
  app.use('/subscription', subscriptionRouter);

  
  app.listen(3000, () => console.log('listen 3000'));
})();