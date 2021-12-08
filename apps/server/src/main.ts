import * as express from 'express';
import { initDb } from "./app/config/database";
import { apiRouter } from "./app/routes";
import * as bodyParser from "body-parser";
import { errorHandler } from "./app/config/error";
import * as fileUpload from "express-fileupload";

async function startServer() {
  const app = express();

  await initDb();

  app.use(bodyParser.json());
  app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  }));
  app.use('/api', apiRouter);
  app.use(errorHandler);

  const port = process.env.port || 3333;
  const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/api`);
  });
  server.on('error', console.error);
}

startServer();
