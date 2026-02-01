import asyncHandler from "../utils/asyncHandler.utils.js";
import APIErrorResponse from "../utils/apiErrorResponse.utils.js";
import APIResponse from "../utils/apiResponse.utils.js";
import { emailRegex, passwordRegex } from "../constant.js";
import { User } from "../models/user.models.js";

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

export { userRegister };
