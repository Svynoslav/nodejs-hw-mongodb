import { initMongoDB } from './db/initMongoDb.js';
import { setupServer } from './server.js';

// ! won't work w/out establishing MongoDB cluster first, create .env or else initMongoDb.js has no values to work w/

const bootstrap = async () => {
  await initMongoDB();
  setupServer();
};
bootstrap();
