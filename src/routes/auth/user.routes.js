import { Router } from "express";
import {
  changePassword,
  loginUser,
  logoutUser,
  registerUser,
  updateAvatar,
} from "../../controllers/auth/user.controllers.js";
import {
  changePasswordValidator,
  loginUserValidator,
  registerUserValidator,
} from "../../validators/auth/user.validators.js";
import { verifyAuthorizationToken } from "../../middlewares/auth.middlewares.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { compressImages } from "../../middlewares/image-compress.middlewares.js";

/**
 * Creates and configures the users router.
 * @returns {Router} The configured users router.
 */
function createUsersRouter() {
  const router = Router();

  router.route("/register").post(registerUserValidator, registerUser);
  router.route("/login").post(loginUserValidator, loginUser);

  router
    .route("/change-password")
    .post(verifyAuthorizationToken, changePasswordValidator, changePassword);

  router.route("/avatar").post(
    verifyAuthorizationToken,
    upload.fields([
      {
        name: "avatar",
        maxCount: 1,
      },
    ]),
    compressImages,
    updateAvatar
  );

  router.route("/logout").post(verifyAuthorizationToken, logoutUser);

  return router;
}

export { createUsersRouter };
