import { Router } from "express";

import {
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
  // forgotPassword,
  // resetPassword,
} from "../controllers/user.controllers";
import {
  userRegisterValidationSchema,
  sendEmailVarificationCodeValidationSchema,
  verifyOTPValidationSchema,
  userLoginValidationSchema,
  updateUserNameValidationSchema,
  updateUserPasswordValidationSchema,
  // deleteUserAccountValidationSchema,
  // resetPasswordValidationSchema,
} from "../validations/user.validations";
import { verifyAuth } from "../middlewares/auth.middlewares";
import { validate } from "../middlewares/validate.middlewares";

const userRouter = Router();

// User registeration.
userRouter
  .route("/register")
  .post(validate(userRegisterValidationSchema), userRegister);

// Send OTP for email verification
userRouter
  .route("/sendEmailVerificationCode")
  .post(
    validate(sendEmailVarificationCodeValidationSchema),
    sendOTPForNewUserEmailVerificaiton,
  );

// Verify OTP for email verification
userRouter
  .route("/verifyOTP")
  .post(validate(verifyOTPValidationSchema), verifyOTP);

// User login.
userRouter.route("/login").post(validate(userLoginValidationSchema), userLogin);

// User logout.
userRouter.route("/logout").get(verifyAuth, userLogout);

// Get user details.
userRouter.route("/getCurrentUser").get(verifyAuth, getCurrentUser);

// Update user's name
userRouter
  .route("/updateName")
  .post(verifyAuth, validate(updateUserNameValidationSchema), updateUserName);

// Update user's password
userRouter
  .route("/updateCurrentPassword")
  .post(
    verifyAuth,
    validate(updateUserPasswordValidationSchema),
    updateUserPassword,
  );

// // Delete user account.
// userRouter
//   .route("/deleteUserAccount")
//   .post(
//     verifyAuth,
//     validate(deleteUserAccountValidationSchema),
//     deleteUserAccount,
//   );

// Get new access token.
userRouter.route("/getNewAccessToken").get(getNewAccessToken);

// // Forgot password.
// userRouter
//   .route("/forgotPassword")
//   .post(validate(forgotPasswordValidationSchema), forgotPassword);

// // Reset new password.
// userRouter
//   .route("/resetPassword/:resetPasswordToken")
//   .post(validate(resetPasswordValidationSchema), resetPassword);

export default userRouter;
