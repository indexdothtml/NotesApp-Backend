import jwt from "jsonwebtoken";
import { v4 as uuidV4 } from "uuid";

import asyncHandler from "../utils/asyncHandler.utils.js";
import APIErrorResponse from "../utils/apiErrorResponse.utils.js";
import APIResponse from "../utils/apiResponse.utils.js";
import sendEmail from "../utils/sendEmail.utils.js";
import { emailRegex, passwordRegex, cookieOptions } from "../constant.js";
import { User } from "../models/user.models.js";
import env from "../envConfig.js";

// User registeration.
const userRegister = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  // Validate fields.
  if (
    [fullName, email, username, password].some(
      (field) => !field || field.toString().trim() === "",
    )
  ) {
    return res
      .status(400)
      .json(new APIErrorResponse(400, "All fields are required."));
  }

  // Validate email rule.
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json(new APIErrorResponse(400, "Expected valid email address."));
  }

  // Validate password rule.
  if (!passwordRegex.test(password)) {
    return res
      .status(400)
      .json(
        new APIErrorResponse(
          400,
          "Expected strong password with numbers, small character, capital character, special character.",
        ),
      );
  }

  // Check if user with given fields already exists.
  const userExist = await User.findOne({ $or: [{ username }, { email }] });

  if (userExist) {
    return res
      .status(409)
      .json(
        new APIErrorResponse(409, "User with given details is already exist."),
      );
  }

  // Create a new user.
  const newUser = await User.create({
    fullName,
    email,
    username,
    password,
  });

  // Verify if user created.
  const user = await User.findById(
    newUser._id,
    "-password -refreshToken -resetPasswordToken -resetPasswordTokenExpiry",
  );

  return res
    .status(201)
    .json(new APIResponse(201, "New user is created.", user));
});

// User login.
const userLogin = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Validate fields.
  if (!(username || email) || !password) {
    return res
      .status(400)
      .json(
        new APIErrorResponse(
          400,
          "Username or Email and Password are required fields.",
        ),
      );
  }

  // Find the user with username or password.
  const user = await User.findOne({
    $or: [
      { username: username?.toString()?.trim() },
      { email: email?.toString()?.trim() },
    ],
  });

  if (!user) {
    return res
      .status(404)
      .json(new APIErrorResponse(404, "User does not exist."));
  }

  // Check password.
  const isPasswordCorrect = await user.checkPassword(password);

  if (!isPasswordCorrect) {
    return res
      .status(401)
      .json(new APIErrorResponse(401, "Incorrect credentials."));
  }

  // Generate access and refresh token.
  const accessToken = user.generateAccessToken();

  const refreshToken = user.generateRefreshToken();

  // Update refreshToken in user's document.
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      $set: { refreshToken },
    },
    {
      lean: true,
      new: true,
    },
  ).select(
    "-password -refreshToken -resetPasswordToken -resetPasswordTokenExpiry",
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new APIResponse(200, "Login success.", {
        ...updatedUser,
        refreshToken,
        accessToken,
      }),
    );
});

// User logout.
const userLogout = asyncHandler(async (req, res) => {
  const user = req?.user;

  await User.findByIdAndUpdate(user._id, { $set: { refreshToken: "" } });

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new APIResponse(200, "Logout success.", { success: true }));
});

// Get User
const getUser = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;

  // Find user with id.
  const user = await User.findById(userId).select(
    "-password -refreshToken -resetPasswordToken -resetPasswordTokenExpiry",
  );

  if (!user) {
    return res.status(404).json(new APIErrorResponse(404, "User not found."));
  }

  return res
    .status(200)
    .json(new APIResponse(200, "Successfully fetched user details.", user));
});

// Update full name of user.
const updateUserFullName = asyncHandler(async (req, res) => {
  const { fullName } = req.body;

  // Validate fullName field.
  if (!fullName || fullName?.toString()?.trim() === "") {
    return res
      .status(400)
      .json(new APIErrorResponse(400, "Field is required."));
  }

  // Get user id.
  const userId = req?.user?._id;

  // Update fullName.
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: { fullName },
    },
    {
      lean: true,
      new: true,
    },
  ).select(
    "-password -refreshToken -resetPasswordToken -resetPasswordTokenExpiry",
  );

  return res
    .status(200)
    .json(new APIResponse(200, "Fullname updated.", updatedUser));
});

// Update user password.
const updateUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // Validate password.
  if (!passwordRegex.test(newPassword)) {
    return res
      .status(400)
      .json(
        new APIErrorResponse(
          400,
          "Expected strong password with numbers, small character, capital character, special character.",
        ),
      );
  }

  // Get User id.
  const userId = req?.user?._id;

  // Find user.
  const user = await User.findById(userId);

  // Check password.
  const isPasswordCorrect = await user.checkPassword(oldPassword);

  if (!isPasswordCorrect) {
    return res
      .status(401)
      .json(new APIErrorResponse(401, "Password is incorrect."));
  }

  // Updating password.
  user.password = newPassword;
  await user.save();

  // TODO: Send email to user.

  return res
    .status(200)
    .json(
      new APIResponse(
        200,
        "Password is updated. Please logout and login again.",
        { success: true },
      ),
    );
});

// Delete user account.
const deleteUserAccount = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;

  // Get the password form user for confirmation.
  const { password } = req.body;

  // Validate password field.
  if (!password || password?.toString()?.trim() === "") {
    return res
      .status(400)
      .json(new APIErrorResponse(400, "Field is required."));
  }

  // Find user.
  const user = await User.findById(userId);

  // Check password.
  const isPasswordCorrect = await user.checkPassword(password);

  if (!isPasswordCorrect) {
    return res
      .status(400)
      .json(new APIErrorResponse(400, "Password is incorrect."));
  }

  // Delete user.
  const deletedUser = await User.deleteOne({ _id: userId });

  if (deletedUser.deletedCount === 0) {
    return res
      .status(404)
      .json(
        new APIErrorResponse(
          404,
          "User deletion failed due to matching user id not found.",
        ),
      );
  }

  // TODO: Delete other data releated to user like notes.
  // TODO: Send email to user.

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(
      new APIResponse(200, "User account deleted successfully.", deletedUser),
    );
});

// Create new access token.
const getNewAccessToken = asyncHandler(async (req, res) => {
  const refreshToken =
    req?.cookies?.refreshToken ||
    req?.headers?.authorization?.replace("Bearer ", "");

  // Verify refresh token.
  if (!refreshToken) {
    return res
      .status(401)
      .json(
        new APIErrorResponse(
          401,
          "User is not authorized to perform this action. Please login again.",
        ),
      );
  }

  // Validate refresh token.
  try {
    const decodedJWTValue = jwt.verify(refreshToken, env.refreshTokenSecret);

    const userId = decodedJWTValue?._id;

    const user = await User.findById(userId);

    if (refreshToken !== user?.refreshToken) {
      return res.status(401).json(new APIErrorResponse(401, "Invalid token."));
    }

    // Create new access token.
    const accessToken = user.generateAccessToken();

    // Send response with new access token.
    return res
      .status(201)
      .cookie("accessToken", accessToken, cookieOptions)
      .json(new APIResponse(201, "Access token generated.", { accessToken }));
  } catch (error) {
    return res
      .status(401)
      .json(
        new APIErrorResponse(
          401,
          `Token verificaiton failed due to ${error}\nPlease login again.`,
        ),
      );
  }
});

// Forgot password.
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Verify email.
  if (!email || email?.toString()?.trim() === "") {
    return res
      .status(400)
      .json(new APIErrorResponse(400, "Please provide email address."));
  }

  // Find user.
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json(new APIErrorResponse(404, "User not found."));
  }

  // Create unique id for reset password unique token.
  const uniqueId = uuidV4();

  user.resetPasswordToken = uniqueId;

  // Calculate expiry time for reset password token, 15 min from current time in miliseconds.
  user.resetPasswordTokenExpiry = Date.now() + 15 * 60 * 1000;

  // Save details.
  await user.save();

  // Create reset password link.
  const resetPasswordLink = `${env.origin}/resetPassword/${uniqueId}`;

  // TODO: send resetPasswordLink via email.
  const sendEmailResponse = await sendEmail(
    "abhi.kshirsagar1100@gmail.com",
    "Reset password",
    `If you have reqested to reset your password then click on the below link\n Link - ${resetPasswordLink}`,
  );

  if (!sendEmailResponse) {
    return res
      .status(500)
      .json(
        new APIErrorResponse(500, "Failed to send email, please try again."),
      );
  }

  return res.status(200).json(
    new APIResponse(200, "Password reset link is shared via email.", {
      success: true,
    }),
  );
});

// Reset password.
const resetPassword = asyncHandler(async (req, res) => {
  //Get the reset token from url.
  const { resetPasswordToken } = req.params;
  const { newPassowrd } = req.body;

  // Validate new password.
  if (!passwordRegex.test(newPassowrd)) {
    return res
      .status(400)
      .json(
        new APIErrorResponse(
          400,
          "Enter strong password containing small case, capital case, numbers and special character.",
        ),
      );
  }

  // Find user with reset token and expiry.
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res
      .status(400)
      .json(new APIErrorResponse(400, "Link is not valid or expired."));
  }

  // Update password and clear resetPasswordToken and resetPasswordTokenExpiry.
  user.password = newPassowrd;
  user.resetPasswordToken = "";
  user.resetPasswordTokenExpiry = 0;
  await user.save();

  return res
    .status(200)
    .json(
      new APIResponse(200, "Password reset successfully.", { success: true }),
    );
});

// NOTE: rate limiting.

export {
  userRegister,
  userLogin,
  userLogout,
  getUser,
  updateUserFullName,
  updateUserPassword,
  deleteUserAccount,
  getNewAccessToken,
  forgotPassword,
  resetPassword,
};
