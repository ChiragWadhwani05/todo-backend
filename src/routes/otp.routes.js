import { Router } from "express";
import { registerOTP } from "../controllers/otp.controllers.js";

/**
 * @returns {Router}
 */
function createOTPRouter() {
  const router = Router();

  router.route("/mail/register").post(registerOTP);

  return router;
}

export { createOTPRouter };
