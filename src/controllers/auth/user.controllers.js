import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user.models.js";
import { ApiError } from "../../utils/apiError.js";
import { OTP } from "../../models/otp.models.js";
import { uploadOnCloudinary, v2 } from "../../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, otp, givenName, familyName } = req.body;

  // ====> Check if user already exists <====

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists.");
  }

  // ====> Check if OTP is valid <====

  const existedOTP = await OTP.findOne({ email });

  if (!existedOTP) {
    throw new ApiError(404, "OTP not found.");
  }

  if (existedOTP.otp !== otp) {
    throw new ApiError(400, "Invalid OTP.");
  }

  await OTP.deleteOne({ email });

  // ====> Create User <====

  const user = new User({
    email,
    username,
    password,
    givenName,
    familyName,
  });

  const authorizationToken = user.generateAccessToken();

  user.authorizationToken = authorizationToken;

  await user.save();

  // ====> Send Response <====

  const responseData = {
    _id: user._id,
    authorizationToken,
  };

  return res
    .status(201)
    .json(new ApiResponse(201, responseData, "User registered successfully."));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // ====> Check if user exists or not <====

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Password is incorrect.");
  }

  const authorizationToken = user.generateAccessToken();

  user.authorizationToken = authorizationToken;

  await user.save();

  // ====> Send Response <====

  const responseData = {
    _id: user._id,
    authorizationToken,
    email: user.email,
    username: user.username,
    givenName: user.givenName,
    familyName: user.familyName,
    avatar: user.avatar,
  };

  return res
    .status(201)
    .json(new ApiResponse(201, responseData, "User login successfully."));
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = req.user;

  user.authorizationToken = "";

  await user.save();

  return res.status(200).json(new ApiResponse(200, null, "Logout success."));
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = req.user;

  const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Password is incorrect.");
  }

  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password changed successfully."));
});

const updateAvatar = asyncHandler(async (req, res) => {
  const user = req.user;

  const avatar = req.files?.avatar[0];
  if (!avatar) {
    throw new ApiError(400, "avatar is required");
  }

  if (user.avatar) {
    await v2.api.delete_resources(
      [user.avatar.substring(user.avatar.lastIndexOf("/") + 1).split(".")[0]],
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
  }

  const uploadedAvatar = await uploadOnCloudinary(avatar.path);
  if (uploadedAvatar === null) {
    throw new ApiError(500, "Failed to upload Image");
  }
  user.avatar = uploadedAvatar.url;

  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { avatar: user.avatar },
        "Avatar updated successfully."
      )
    );
});

const getUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully."));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  changePassword,
  updateAvatar,
  getUser,
};
