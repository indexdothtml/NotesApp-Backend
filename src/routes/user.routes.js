import { Router } from "express";

import {
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
} from "../controllers/user.controllers.js";
import verifyAuth from "../middlewares/auth.middlewares.js";

const userRouter = Router();

// User registeration.
userRouter.route("/register").post(userRegister);

// User login.
userRouter.route("/login").post(userLogin);

// User logout.
userRouter.route("/logout").get(verifyAuth, userLogout);

// Get user details.
userRouter.route("/getUserDetails").get(verifyAuth, getUser);

// Update user's fullname
userRouter.route("/updateFullName").post(verifyAuth, updateUserFullName);

// Update user's password
userRouter.route("/updatePassword").post(verifyAuth, updateUserPassword);

// Delete user account.
userRouter.route("/deleteUserAccount").post(verifyAuth, deleteUserAccount);

// Get new access token.
userRouter.route("/getNewAccessToken").get(getNewAccessToken);

// Forgot password.
userRouter.route("/forgotPassword").post(forgotPassword);

// Reset new password.
userRouter.route("/resetPassword/:resetPasswordToken").post(resetPassword);

export default userRouter;
