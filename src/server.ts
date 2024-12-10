import * as path from "path";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import compression from "compression";
import queue from "@marlon360/express-queue";
import axios from "axios";

import { RKIError, CreateRedisClient } from "./utils";

export const cache = require("express-redis-cache-next")({
  expire: { 200: 1800, 400: 180, 503: 180, xxx: 180 },
  host: process.env.REDISHOST || process.env.REDIS_URL,
  port: process.env.REDISPORT,
  auth_pass: process.env.REDISPASSWORD,
});

// create redis client for base data
export const redisClientBas = CreateRedisClient("bas:");

Date.prototype.toJSON = function () {
  return this.toISOString();
};

export const app = express();
const port = 3000;

app.use("/docs", express.static(path.join(__dirname, "docs")));
app.use(cors());
app.use(compression());

export const queuedCache = () => {
  const cacheQueue = queue({ activeLimit: 2 });
  return function (req: Request, res: Response, next: NextFunction) {
    const cacheName = req.originalUrl;
    cache.get(cacheName, function (error, entries) {
      if (error) {
        return next();
      }
      if (entries.length > 0) {
        return next();
      } else {
        return cacheQueue(req, res, next);
      }
    });
  };
};

app.get("/", async function (req, res) {
  res.redirect("docs");
});
// import video endpoints
import "./videoEndpoints";
// import germany endpoints
import "./germanyEndpoints";
// import states endpoints
import "./statesEndpoints";
// import districts endpoints
import "./districtsEndpoints";
// import vaccinationsEndpoints
import "./vaccinationsEndpoints";
// import mapEndpoints
import "./mapEndpoints";
// import testingEndpoints
import "./testingEndpoints";

app.use(function (error: any, req: Request, res: Response, next: NextFunction) {
  if (error instanceof RKIError) {
    res.status(error.rkiError.code).json({
      error: {
        message: "There is a problem with the official RKI API.",
        rkiError: error.rkiError,
        url: error.url || "",
      },
    });
  } else if (axios.isAxiosError(error)) {
    if (error.response) {
      res.status(error.response.status).json({
        error: {
          message: "An error occurred while fetching external data.",
          url: error.config.url,
          details: error.message,
          response: error.response.data,
        },
      });
    } else if (error.request) {
      res.status(400).json({
        error: {
          message: "An error occurred while request external data.",
          request: error.request,
        },
      });
    }
  } else {
    const baseError = error as Error;
    res.status(400).json({
      error: {
        message: "An error occurred.",
        details: baseError.message,
        stack: baseError.stack,
      },
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
