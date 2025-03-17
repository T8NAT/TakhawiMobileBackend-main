import express, { NextFunction, Request, Response } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import pug from 'pug';
import morgan from 'morgan';
import path from 'node:path';
import router from './src/routers';
import globalError from './src/middlewares/errorMiddleware';
import seeding from './prisma/seeding';
import setLanguage from './src/middlewares/set-language';
import { server, app, i18nInit } from './src/utils/socket';
import cronJobs from './src/cron-jobs';
import bodyParser from 'body-parser';
import { nafathRoutes } from './src/routers/nafathRoutes';
import paymentGatewayService from './src/services/paymentGatewayService';

config();

seeding();
cronJobs();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));
app.use('/assets', express.static('assets'));

// Initialize Localization
app.use(i18nInit);

// Set Localized Language
app.use(setLanguage);

app.use(morgan('dev'));

app.get(
  '/.well-known/apple-developer-merchantid-domain-association.txt',
  (req, res) => {
    res.sendFile(
      `${path.join(__dirname, '../')}/apple-developer-merchantid-domain-association.txt`,
    );
  },
);
app.get(
  '/apple-pay',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const amount = req.query && req.query.amount ? Number(req.query.amount).toFixed(2) : '1.00';
      // const checkOut = await paymentGatewayService.prepareCheckout({
      //   amount,
      // });
      // const html = pug.renderFile('./src/templates/applePay.pug', {
      //   checkoutId: checkOut.id,
      //   amount,
      //   merchantIdentifier: process.env.APPLEPAY_ENTITY_ID,
      // });
      // res.send(html);
      res.sendFile(`${__dirname}/index.html`);
    } catch (error) {
      next(error);
    }
  },
);
app.use(bodyParser.json());

// إضافة الـ route الخاصة بالتحقق من الهوية
app.use(express.json());

app.use('/api/v1/mfa', nafathRoutes);

app.post('/apple-pay', (req: Request, res: Response) => {
  res.send({
    message: 'Apple Pay Payment Success',
    body: req.body,
  });
});
app.get('/', (req: Request, res: Response) => {
  console.log(`Environment: ${process.env.NODE_ENV}`);
  res.send('Hello World!');
});
app.use('/api', router);

app.all('*', (req, res) => {
  res.status(404).json({
    status: false,
    message: `Endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use(globalError);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
