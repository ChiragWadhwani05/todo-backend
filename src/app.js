import express from "express";
import process from "node:process";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redisInstance } from "./services/redis.services.js";
import { ApiError } from "./utils/apiError.js";
import { ApiResponse } from "./utils/apiResponse.js";
import { createRouter } from "./routes/index.js";
import { errorHandler } from "./middlewares/error.middlewares.js";
import { asyncHandler } from "./utils/asyncHandler.js";

function startApp() {
  const app = express();

  // Disable x-powered-by header from express
  app.disable("x-powered-by");

  // CORS settings
  const corsOrigin = process.env.CORS_ORIGIN || "*";
  app.use(
    cors({
      origin: corsOrigin.split(","),
      credentials: true,
      exposedHeaders: "*",
      methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
    })
  );

  // Rate limiting
  const limiterResponse = new ApiError(
    429,
    "Too many requests, please try again later."
  );
  const limiter = rateLimit({
    windowMs: 1000 * 60 * 1,
    max: 200,
    message: { ...limiterResponse, message: limiterResponse.message },
    store: new RedisStore({
      sendCommand: (...args) => redisInstance.call(...args),
    }),
  });

  app.use(limiter);

  // Body parser
  app.use(
    express.json({
      limit: "50mb",
      type: "application/json",
    })
  );

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    return res.status(200).json(new ApiResponse(200));
  });

  // API routes
  app.use("/api", createRouter());

  // Handle unknown endpoints
  app.use(
    "*",
    asyncHandler(() => {
      throw new ApiError(404, "Endpoint not found.");
    })
  );

  // Error handling middleware
  app.use(errorHandler);

  return app;
}

export { startApp };
