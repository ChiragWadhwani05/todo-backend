import { Router } from "express";
import {
  createTodo,
  deleteTodo,
  getTodo,
  getTodos,
  updateCoverImage,
  updateTodo,
} from "../controllers/todo.controllers.js";
import { verifyAuthorizationToken } from "../middlewares/auth.middlewares.js";
import {
  createTodoValidator,
  updateTodoValidator,
} from "../validators/todo.validators.js";
import { upload } from "../middlewares/multer.middleware.js";
import { compressImages } from "../middlewares/image-compress.middlewares.js";

/**
 * @returns {Router}
 */
function createTodosRouter() {
  const router = Router();

  router.use(verifyAuthorizationToken);

  router.route("/").post(createTodoValidator, createTodo).get(getTodos);

  router
    .route("/cover-image/:id")
    .post(
      upload.fields([{ name: "coverImage", maxCount: 1 }]),
      compressImages,
      updateCoverImage
    );

  router
    .route("/:id")
    .get(getTodo)
    .patch(updateTodoValidator, updateTodo)
    .delete(deleteTodo);

  return router;
}

export { createTodosRouter };
