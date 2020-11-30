import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";

import { rpcServer } from "./rpc-server";
import { logger, reqLogger, reqErrorLogger } from "./logger";
import { dbConnect } from "./db";
import { get_ws_provider, restartSubscriptions } from "./blockchain";

const main = async () => {
  dotenv.config();
  const port = process.env.SERVER_PORT;

  logger.info("Starting commmitment manager server...");

  const dbUrl = 'mongodb://' +
    `${process.env.DATABASE_USER}` + ':' +
    `${process.env.DATABASE_PASSWORD}` + '@' +
    `${process.env.DATABASE_HOST}` + '/' +
    `${process.env.DATABASE_NAME}`;

  logger.debug(`Attempting to connect to db: ${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}`)

  await dbConnect(dbUrl);
  await get_ws_provider(); // Establish websocket connection
  await restartSubscriptions(); // Enable event listeners for active MerkleTrees

  const app = express();

  app.use(reqLogger('COMMIT-MGR')); // Log requests
  app.use(reqErrorLogger('COMMIT-MGR')); // Log errors
  app.use(bodyParser.json({ limit: "2mb" })); // Pre-parse body content

  app.get('/status', async (req: any, res: any) => {
    res.sendStatus(200);
  });

  // Single endpoint to handle all JSON-RPC requests
  app.post("/jsonrpc", async (req: any, res: any, next: any) => {
    const context = {
      headers: req.headers,
      params: req.params,
      body: req.body,
      ipAddress:
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress,
    };

    await rpcServer.call(req.body, context, (err: any, result: any) => {
      if (err) {
        const errorMessage = err.error.data ? `${err.error.message}: ${err.error.data}` : `${err.error.message}`;
        logger.error(`Response error: ${errorMessage}`);
        res.send(err);
        return;
      }
      res.send(result || {});
    });
  });

  app.listen(port, () => {
    logger.info(`REST server listening on port ${port}.`);
  });
};

main();
