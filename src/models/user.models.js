import { Schema, model } from "mongoose";
import {
  AvailableUserRoles,
  UserRoleEnum,
  AvailableUserLogins,
  UserLoginEnum,
} from "../constants.js";
import jwt from "jsonwebtoken";
import process from "process";
import bcryptjs from "bcryptjs";

const userSchema = new Schema(
  {
    givenName: {
      type: String,
      required: true,
    },
    familyName: {
      type: String,
    },
    avatar: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: AvailableUserRoles,
      default: UserRoleEnum.USER,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    loginType: {
      type: String,
      enum: AvailableUserLogins,
      default: UserLoginEnum.EMAIL_PASSWORD,
    },
    authorizationToken: {
      type: String,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }

    this.password = await bcryptjs.hash(this.password, 10);

    next();
  } catch (error) {
    console.log("Error occurred during userSchema pre save:");
    next(error);
  }
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  const payload = { _id: this._id };

  return jwt.sign(payload, String(process.env.ACCESS_TOKEN_SECRET), {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

userSchema.methods.generateRefreshToken = function () {
  const payload = { _id: this._id };

  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

const User = model("User", userSchema);

export { User };
