import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import process from "process";

/**
 * @description Function to verify the Authorization Token and store user inside req.user
 *
 * @type {import("express").RequestHandler}
 */
async function verifyAuthorizationToken(req, res, next) {
  try {
    let authorizationToken;

    if (req.header("Authorization")) {
      authorizationToken = req.header("Authorization");
    }

    if (!authorizationToken) {
      throw new ApiError(401, "No Authorization token found");
    }

    authorizationToken = authorizationToken.replace("Bearer ", "");
    const decodedToken = jwt.verify(
      authorizationToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(400, "Invalid Authorization token");
    }

    if (user.authorizationToken !== authorizationToken) {
      throw new ApiError(400, "Invalid Authorization token");
    }

    // Store user in req.user for next function to use
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * @description Authorize roles of user for the given roles
 *
 * @param  {string[]} roles
 * @returns {import("express").RequestHandler}
 */
function authorizeRoles(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Role: ${req.user.role} is not allowed to access this resource`
      );
    }
    next();
  };
}

export { verifyAuthorizationToken, authorizeRoles };
