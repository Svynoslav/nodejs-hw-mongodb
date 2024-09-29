import { initMongoDB } from './db/initMongoDb.js';
import { setupServer } from './server.js';

const bootstrap = async () => {
  await initMongoDB();
  setupServer();
};
bootstrap();
