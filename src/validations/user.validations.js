import Joi from "joi";

import { passwordRegex } from "../constant.js";

// Validation schema for user registeration input fields.
const userRegisterValidationSchema = Joi.object({
  fullName: Joi.string().trim().required(),
  email: Joi.string().trim().email().required(),
  username: Joi.string().trim().alphanum().min(3).max(30).required(),
  password: Joi.string()
    .pattern(passwordRegex)
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
    })
    .required(),
});

// Validation schema for user login input fields.
const userLoginValidationSchema = Joi.object({
  username: Joi.string().trim().alphanum().min(3).max(30),
  email: Joi.string().trim().email(),
  password: Joi.string().required(),
})
  .xor("username", "email")
  .messages({
    "object.missing": "Please provide either email or username.",
    "object.xor": "Please provide either email or username, but not both.",
  }); // any of the one from username or password is required not both.

export { userRegisterValidationSchema, userLoginValidationSchema };
