import { Router } from "express";
import { createUsersRouter } from "./auth/user.routes.js";
import { createOTPRouter } from "./otp.routes.js";
import { createTodosRouter } from "./todo.routes.js";

function createRouter() {
  const router = Router();

  router.use("/v1", createV1Router());

  return router;
}

function createV1Router() {
  const router = Router();

  router.use("/users", createUsersRouter());
  router.use("/otp", createOTPRouter());
  router.use("/todos", createTodosRouter());

  return router;
}

export { createRouter };
