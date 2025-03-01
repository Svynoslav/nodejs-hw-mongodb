import * as fs from 'node:fs';
import path from 'node:path';

import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUI from 'swagger-ui-express';

import { env } from './utils/env.js';

import router from './routers/index.js';

import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const swaggerDoc = JSON.parse(
  fs.readFileSync(path.resolve('docs/swagger.json'), 'utf-8'),
);

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  console.log(swaggerDoc);

  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

  app.use(express.json());
  app.use('/avatars', express.static(path.resolve('src/public/avatars')));

  app.use(cors());
  app.use(cookieParser());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use('/', router);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
