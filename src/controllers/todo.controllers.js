import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { Todo } from "../models/todo.models.js";
import { uploadOnCloudinary, v2 } from "../utils/cloudinary.js";

const createTodo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const todo = new Todo({
    title,
    description,
    owner: req.user._id,
  });

  todo.save();

  return res
    .status(201)
    .json(new ApiResponse(201, todo, "Todo created successfully."));
});

const getTodos = asyncHandler(async (req, res) => {
  const todos = await Todo.find({
    owner: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, todos, "All todos get successfully."));
});

const getTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    throw new ApiError(404, "Todo not found.");
  }

  if (todo.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(401, "Unauthorized.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, todo, "Todo get successfully."));
});

const updateTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    throw new ApiError(404, "Todo not found.");
  }

  if (todo.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(401, "Unauthorized.");
  }

  const { title, description, isComplete } = req.body;

  if (title) {
    todo.title = title;
  }

  if (description) {
    todo.description = description;
  }

  if (typeof isComplete === "boolean") {
    todo.isComplete = isComplete;
  }

  await todo.save();

  return res
    .status(200)
    .json(new ApiResponse(200, todo, "Todo updated successfully."));
});

const deleteTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    throw new ApiError(404, "Todo not found.");
  }

  if (todo.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(401, "Unauthorized.");
  }

  if (todo.coverImage) {
    await v2.api.delete_resources(
      [
        todo.coverImage
          .substring(todo.coverImage.lastIndexOf("/") + 1)
          .split(".")[0],
      ],
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
  }

  await todo.deleteOne();

  return res
    .status(204)
    .json(new ApiResponse(204, null, "Todo deleted successfully."));
});

const updateCoverImage = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    throw new ApiError(404, "Todo not found.");
  }

  if (todo.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(401, "Unauthorized.");
  }

  const coverImage = req.files?.coverImage[0];
  if (!coverImage) {
    throw new ApiError(400, "coverImage is required");
  }

  if (todo.coverImage) {
    await v2.api.delete_resources(
      [
        todo.coverImage
          .substring(todo.coverImage.lastIndexOf("/") + 1)
          .split(".")[0],
      ],
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
  }

  const uploadedCoverImage = await uploadOnCloudinary(coverImage.path);
  if (uploadedCoverImage === null) {
    throw new ApiError(500, "Failed to upload Image");
  }

  todo.coverImage = uploadedCoverImage.url;
  await todo.save();
  1;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { coverImage: todo.coverImage },
        "Avatar updated successfully."
      )
    );
});

export {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  deleteTodo,
  updateCoverImage,
};
