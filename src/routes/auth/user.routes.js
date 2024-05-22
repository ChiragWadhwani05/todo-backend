import { Router } from "express";
import {
  changePassword,
  getUser,
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

  router.use(verifyAuthorizationToken);

  router
    .route("/change-password")
    .post(changePasswordValidator, changePassword);

  router.route("/avatar").post(
    upload.fields([
      {
        name: "avatar",
        maxCount: 1,
      },
    ]),
    compressImages,
    updateAvatar
  );

  router.route("/logout").post(logoutUser);
  router.route("/").get(getUser);

  return router;
}

export { createUsersRouter };
