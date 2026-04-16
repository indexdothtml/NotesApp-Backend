import jwt from "jsonwebtoken";
import { v4 as uuidV4 } from "uuid";
import type { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler.utils";
import { APIErrorResponse } from "../utils/apiErrorResponse.utils";
import { APIResponse } from "../utils/apiResponse.utils";
import { sendEmail } from "../utils/sendEmail.utils";
import { redis } from "../redis/connections.redis";
import { cookieOptions } from "../constant";
import { User } from "../models/user.models";
// import { Note } from "../models/note.models";
import { logger } from "../loggerConfig";
import { env } from "../envConfig";

// User registeration.
const userRegister = asyncHandler(
  async (request: Request, response: Response) => {
    const { name, email, password } = request.body;

    // Check if user already exist.
    const userExist = await User.findOne({ email });

    if (userExist) {
      return response
        .status(409)
        .json(new APIErrorResponse(409, "Account already exist!"));
    }

    // Check if redis is available and connection is success.
    if (!redis) {
      return response
        .status(500)
        .json(new APIErrorResponse(500, "Redis client failed to connect!"));
    }

    // Check if email is verified.
    const isEmailVerified = await redis.get(`isVerified:${email}`);

    if (!isEmailVerified || isEmailVerified === "0") {
      return response
        .status(401)
        .json(new APIErrorResponse(401, "Email is not verified!"));
    }

    // Delete the cache because its used now and not required anymore.
    await redis.del(`isVerified:${email}`);

    // Create a new user.
    const newUser = await User.create({
      name,
      email,
      isEmailVerified: true,
      password,
    });

    // Verify if user created.
    const user = await User.findById(
      newUser._id,
      "-password -refreshToken -resetPasswordToken -resetPasswordTokenExpiry",
    );

    return response
      .status(201)
      .json(new APIResponse(201, "Account created successfully!", user));
  },
);

// Send email varification otp.
const sendOTPForNewUserEmailVerificaiton = asyncHandler(
  async (request: Request, response: Response) => {
    const { email } = request.body;

    // Check if user already exist.
    const userExist = await User.findOne({ email });

    if (userExist) {
      return response
        .status(409)
        .json(new APIErrorResponse(409, "Account already exist!"));
    }

    // Generate 6 digits of verification code.
    const otp6Digit = `${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`;

    // Check if redis is available and connection is success.
    if (!redis) {
      return response
        .status(500)
        .json(new APIErrorResponse(500, "Redis client failed to connect!"));
    }

    // Send email with verification code.
    const isEmailSent = await sendEmail(
      email,
      "Welcome!",
      `Your email verification code: ${otp6Digit}`,
    );

    // Check if email is sent.
    if (!isEmailSent) {
      return response
        .status(500)
        .json(new APIErrorResponse(500, "Failed to send otp!"));
    }

    // Set verification code in cache memory using redis.
    // Set verification code with 5 minutes of expiry.
    // If verification code set again in cache it will override value and reset timer.
    const keyExpiryInSeconds = 300;
    await redis.set(`otp:${email}`, otp6Digit, {
      expiration: { type: "EX", value: keyExpiryInSeconds },
    });

    // Set verification status
    await redis.set(`isVerified:${email}`, 0);

    return response.status(200).json(
      new APIResponse(200, `Verification code is shared on ${email}`, {
        expiredIn: keyExpiryInSeconds * 1000,
      }),
    );
  },
);

// Verify user entered verification code.
const verifyOTP = asyncHandler(async (request: Request, response: Response) => {
  const { email, otp } = request.body;

  // Check if redis is available and connection is success.
  if (!redis) {
    return response
      .status(500)
      .json(new APIErrorResponse(500, "Redis client failed to connect!"));
  }

  // Get cached otp and check if it is correct.
  const cachedOTP = await redis.get(`otp:${email}`);

  if (otp !== cachedOTP) {
    return response
      .status(401)
      .json(new APIErrorResponse(401, "Verification code is not correct."));
  }

  // Delete otp and set isVerified true
  await redis.del(`otp:${email}`);

  await redis.set(`isVerified:${email}`, 1);

  return response
    .status(200)
    .json(
      new APIResponse(200, "Verification code is verified successfully.", null),
    );
});

// User login.
const userLogin = asyncHandler(async (request: Request, response: Response) => {
  const { email, password } = request.body;

  // Find the user with email exist.
  const user = await User.findOne({
    email: email?.toString()?.trim(),
  });

  if (!user) {
    return response
      .status(404)
      .json(new APIErrorResponse(404, "User does not exist."));
  }

  // Check password.
  const isPasswordCorrect = await user.checkPassword(password);

  if (!isPasswordCorrect) {
    return response
      .status(401)
      .json(new APIErrorResponse(401, "Password is not correct."));
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

  return response
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
const userLogout = asyncHandler(
  async (request: Request, response: Response) => {
    const user = request.user;

    // Search user and remove refreshToken.
    await User.findByIdAndUpdate(user?._id, { $set: { refreshToken: "" } });

    return response
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .json(new APIResponse(200, "Logout success.", null));
  },
);

// Get current user details
const getCurrentUser = asyncHandler(
  async (request: Request, response: Response) => {
    const userId = request.user?._id;

    // Find user with id.
    const user = await User.findById(userId).select(
      "-password -refreshToken -resetPasswordToken -resetPasswordTokenExpiry",
    );

    if (!user) {
      return response
        .status(404)
        .json(new APIErrorResponse(404, "User not found."));
    }

    return response
      .status(200)
      .json(new APIResponse(200, "Successfully fetched user details.", user));
  },
);

// Update name of user.
const updateUserName = asyncHandler(
  async (request: Request, response: Response) => {
    const { name } = request.body;

    // Get user id.
    const userId = request.user?._id;

    // Update fullName.
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: { name },
      },
      {
        lean: true,
        new: true,
      },
    ).select(
      "-password -refreshToken -resetPasswordToken -resetPasswordTokenExpiry",
    );

    return response
      .status(200)
      .json(new APIResponse(200, "User's name is updated.", updatedUser));
  },
);

// Update user's password.
const updateUserPassword = asyncHandler(
  async (request: Request, response: Response) => {
    const { oldPassword, newPassword } = request.body;

    // Get User id.
    const userId = request.user?._id;

    // Find user if exist.
    const user = await User.findById(userId);

    if (!user) {
      return response
        .status(404)
        .json(new APIErrorResponse(404, "User does not exist."));
    }

    // Check password.
    const isPasswordCorrect = await user.checkPassword(oldPassword);

    if (!isPasswordCorrect) {
      return response
        .status(401)
        .json(new APIErrorResponse(401, "Password is not correct."));
    }

    // Updating password.
    user.password = newPassword;
    await user.save();

    return response
      .status(200)
      .json(
        new APIResponse(
          200,
          "Password is updated. Please logout and login again.",
          null,
        ),
      );
  },
);

// // Delete user account.
// const deleteUserAccount = asyncHandler(async (req, res) => {
//   const userId = req?.user?._id;

//   // Get the password form user for confirmation.
//   const { password } = req.body;

//   // Find user.
//   const user = await User.findById(userId);

//   // Check password.
//   const isPasswordCorrect = await user.checkPassword(password);

//   if (!isPasswordCorrect) {
//     return res
//       .status(400)
//       .json(new APIErrorResponse(400, "Password is incorrect."));
//   }

//   // Delete user.
//   const deletedUser = await User.deleteOne({ _id: userId });

//   if (deletedUser.deletedCount === 0) {
//     return res
//       .status(404)
//       .json(
//         new APIErrorResponse(
//           404,
//           "User deletion failed due to matching user id not found.",
//         ),
//       );
//   }

//   // Delete other data releated to user like notes.
//   await Note.deleteMany({ owner: user._id });
//   // TODO: Send email to user.

//   return res
//     .status(200)
//     .clearCookie("accessToken", cookieOptions)
//     .clearCookie("refreshToken", cookieOptions)
//     .json(
//       new APIResponse(200, "User account deleted successfully.", deletedUser),
//     );
// });

// Create new access token.
const getNewAccessToken = asyncHandler(
  async (request: Request, response: Response) => {
    const refreshToken =
      request.cookies?.refreshToken ||
      request.headers?.authorization?.replace("Bearer ", "");

    // Verify refresh token.
    if (!refreshToken) {
      return response
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
      // Check if refresh token loaded form env.
      if (!env.refreshTokenSecret) {
        logger.error(
          "Failed to load refreshTokenSecret from environment variables.",
        );
        return response
          .status(500)
          .json(new APIErrorResponse(500, "Couldn't able to read token."));
      }

      // Get the decoded value from refresh token.
      const decodedJWTValue = jwt.verify(
        refreshToken,
        env.refreshTokenSecret,
      ) as { _id: string };

      // Search user with decoded user id value from token.
      const user = await User.findById(decodedJWTValue?._id);

      if (!user) {
        return response
          .status(401)
          .json(new APIErrorResponse(401, "Token is not valid."));
      }

      // Create new access token.
      const accessToken = user.generateAccessToken();

      // Send response with new access token.
      return response
        .status(201)
        .cookie("accessToken", accessToken, cookieOptions)
        .json(new APIResponse(201, "Access token generated.", { accessToken }));
    } catch (error) {
      return response
        .status(401)
        .json(
          new APIErrorResponse(
            401,
            `Token verificaiton failed due to ${error}\nPlease login again.`,
          ),
        );
    }
  },
);

// Forgot password.
const forgotPassword = asyncHandler(
  async (request: Request, response: Response) => {
    const { email } = request.body;

    // Find user.
    const user = await User.findOne({ email });

    if (!user) {
      return response
        .status(404)
        .json(new APIErrorResponse(404, "Account does not exist."));
    }

    // Create unique id for reset password unique token.
    const uniqueId = uuidV4();

    // Check if redis is available and connection is success.
    if (!redis) {
      return response
        .status(500)
        .json(new APIErrorResponse(500, "Redis client failed to connect!"));
    }

    // Save token in cache. For 15 min = 900 seconds
    await redis.set(`passwordResetToken:${uniqueId}`, email, {
      expiration: { type: "EX", value: 900 },
    });

    // Create reset password link.
    const resetPasswordLink = `${env.origin}/resetPassword/${uniqueId}`;

    // Send resetPasswordLink via email.
    const isEmailSent = await sendEmail(
      email,
      "Password reset",
      `Your password reset link: ${resetPasswordLink}`,
    );

    if (!isEmailSent) {
      logger.error("Failed to send password reset link.");
      return response
        .status(500)
        .json(
          new APIErrorResponse(500, "Failed to send email, please try again."),
        );
    }

    return response
      .status(200)
      .json(
        new APIResponse(200, "Password reset link is shared via email.", null),
      );
  },
);

// Reset password.
const resetPassword = asyncHandler(
  async (request: Request, response: Response) => {
    //Get the reset token from url.
    const { resetPasswordToken } = request.params;
    const { password } = request.body;

    // Check if redis is available and connection is success.
    if (!redis) {
      return response
        .status(500)
        .json(new APIErrorResponse(500, "Redis client failed to connect!"));
    }

    // Get token from cache.
    const email = await redis.get(`passwordResetToken:${resetPasswordToken}`);

    if (!email) {
      return response
        .status(400)
        .json(new APIErrorResponse(400, "Reset link is not valid or expired."));
    }

    // Find user with email.
    const user = await User.findOne({ email });

    if (!user) {
      return response
        .status(404)
        .json(new APIErrorResponse(404, "Account does not found!"));
    }

    // Update password.
    user.password = password;
    await user.save();

    // Delete token after use.
    await redis.del(`passwordResetToken:${resetPasswordToken}`);

    return response
      .status(200)
      .json(new APIResponse(200, "Password reset successfully.", null));
  },
);

// NOTE: rate limiting.

export {
  userRegister,
  sendOTPForNewUserEmailVerificaiton,
  verifyOTP,
  userLogin,
  userLogout,
  getCurrentUser,
  updateUserName,
  updateUserPassword,
  // deleteUserAccount,
  getNewAccessToken,
  forgotPassword,
  resetPassword,
};
