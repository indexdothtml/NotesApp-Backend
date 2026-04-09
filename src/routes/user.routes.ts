import { Router } from "express";

import {
  userRegister,
  sendOTPForNewUserEmailVerificaiton,
  // userLogin,
  // userLogout,
  // getUser,
  // updateUserFullName,
  // updateUserPassword,
  // deleteUserAccount,
  // getNewAccessToken,
  // forgotPassword,
  // resetPassword,
} from "@/controllers/user.controllers";
import {
  userRegisterValidationSchema,
  sendEmailVarificationOTP,
  // userLoginValidationSchema,
  // updateUserFullNameValidationSchema,
  // updateUserPasswordValidationSchema,
  // deleteUserAccountValidationSchema,
  // forgotPasswordValidationSchema,
  // resetPasswordValidationSchema,
} from "@/validations/user.validations";
import { verifyAuth } from "@/middlewares/auth.middlewares";
import { validate } from "@/middlewares/validate.middlewares";

const userRouter = Router();

// User registeration.
userRouter
  .route("/register")
  .post(validate(userRegisterValidationSchema), userRegister);

// Send OTP for email verification
userRouter
  .route("/sendVerificationOTP")
  .post(validate(sendEmailVarificationOTP), sendOTPForNewUserEmailVerificaiton);

// // User login.
// userRouter.route("/login").post(validate(userLoginValidationSchema), userLogin);

// // User logout.
// userRouter.route("/logout").get(verifyAuth, userLogout);

// // Get user details.
// userRouter.route("/getUserDetails").get(verifyAuth, getUser);

// // Update user's fullname
// userRouter
//   .route("/updateFullName")
//   .post(
//     verifyAuth,
//     validate(updateUserFullNameValidationSchema),
//     updateUserFullName,
//   );

// // Update user's password
// userRouter
//   .route("/updatePassword")
//   .post(
//     verifyAuth,
//     validate(updateUserPasswordValidationSchema),
//     updateUserPassword,
//   );

// // Delete user account.
// userRouter
//   .route("/deleteUserAccount")
//   .post(
//     verifyAuth,
//     validate(deleteUserAccountValidationSchema),
//     deleteUserAccount,
//   );

// // Get new access token.
// userRouter.route("/getNewAccessToken").get(getNewAccessToken);

// // Forgot password.
// userRouter
//   .route("/forgotPassword")
//   .post(validate(forgotPasswordValidationSchema), forgotPassword);

// // Reset new password.
// userRouter
//   .route("/resetPassword/:resetPasswordToken")
//   .post(validate(resetPasswordValidationSchema), resetPassword);

export default userRouter;
