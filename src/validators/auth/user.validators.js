import { body } from "express-validator";
import { validate } from "../index.js";

const registerUserValidator = validate([
  body("givenName")
    .isString()
    .withMessage("givenName must be defined of type string")
    .notEmpty()
    .withMessage("givenName cannot be empty"),
  body("familyName")
    .optional()
    .isString()
    .withMessage("familyName must be defined of type string"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid"),
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLowercase()
    .withMessage("Username must be lowercase")
    .isLength({ min: 3 })
    .withMessage("Username must be at lease 3 characters long"),
  body("password")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    })
    .withMessage("Password must be strong."),
]);

const loginUserValidator = validate([
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid"),
  body("password")
    .isStrongPassword({
      minLength: 8,
    })
    .withMessage("Password must be strong."),
]);

const changePasswordValidator = validate([
  body("currentPassword")
    .trim()
    .notEmpty()
    .withMessage("Current password is required."),
  body("newPassword")
    .isStrongPassword({
      minLength: 8,
    })
    .withMessage("New password must be strong."),
]);

export { registerUserValidator, loginUserValidator, changePasswordValidator };
