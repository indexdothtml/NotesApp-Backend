import asyncHandler from "../utils/asyncHandler.utils.js";
import APIErrorResponse from "../utils/apiErrorResponse.utils.js";
import APIResponse from "../utils/apiResponse.utils.js";
import { emailRegex, passwordRegex, cookieOptions } from "../constant.js";
import { User } from "../models/user.models.js";

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
  const user = await User.findById(newUser._id, "-password -refreshToken");

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
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new APIResponse(200, "Login success.", { ...updatedUser, accessToken }),
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

export { userRegister, userLogin, userLogout };
