import Joi from "joi";

import { passwordRegex } from "@/constant";

// Validation schema for user registeration input fields.
const userRegisterValidationSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().trim().email().required(),
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
  email: Joi.string().trim().email().required(),
  password: Joi.string().required(),
});

// Validation schema for update fullname input field.
const updateUserFullNameValidationSchema = Joi.object({
  fullName: Joi.string().trim().required(),
});

// Validation schema for update password input fields.
const updateUserPasswordValidationSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string()
    .pattern(passwordRegex)
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
    })
    .required(),
});

// Validation schema for delete user input field.
const deleteUserAccountValidationSchema = Joi.object({
  password: Joi.string().required(),
});

// Validation schema for forgot password input field.
const forgotPasswordValidationSchema = Joi.object({
  email: Joi.string().trim().email().required(),
});

// Validation schema for reset password input field.
const resetPasswordValidationSchema = Joi.object({
  newPassowrd: Joi.string()
    .pattern(passwordRegex)
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
    })
    .required(),
});

export {
  userRegisterValidationSchema,
  userLoginValidationSchema,
  updateUserFullNameValidationSchema,
  updateUserPasswordValidationSchema,
  deleteUserAccountValidationSchema,
  forgotPasswordValidationSchema,
  resetPasswordValidationSchema,
};
