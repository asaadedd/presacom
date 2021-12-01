import * as express from 'express';
import { initDb } from "./app/config/database";
import { apiRouter } from "./app/routes";
import * as bodyParser from "body-parser";

async function startServer() {
  const app = express();

  await initDb();

  app.use(bodyParser.json());
  app.get('/api', apiRouter);

  const port = process.env.port || 3333;
  const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/api`);
  });
  server.on('error', console.error);
}

startServer();
