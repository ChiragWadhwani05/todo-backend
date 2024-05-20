import { body } from "express-validator";
import { validate } from "./index.js";

const createTodoValidator = validate([
  body("title")
    .isString()
    .withMessage("givenName must be defined of type string")
    .notEmpty()
    .withMessage("givenName cannot be empty"),
  body("description")
    .optional()
    .isString()
    .withMessage("familyName must be defined of type string"),
]);

const updateTodoValidator = validate([
  body("title")
    .optional()
    .isString()
    .withMessage("givenName must be defined of type string")
    .notEmpty()
    .withMessage("givenName cannot be empty"),
  body("description")
    .optional()
    .isString()
    .withMessage("description must be defined of type string"),
  body("isComplete")
    .optional()
    .isBoolean()
    .withMessage("isComplete must be defined of type boolean"),
]);

export { createTodoValidator, updateTodoValidator };
