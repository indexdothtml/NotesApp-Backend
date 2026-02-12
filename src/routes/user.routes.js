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

const userRoute = Router();

// User registeration.
userRoute.route("/register").post(userRegister);

// User login.
userRoute.route("/login").post(userLogin);

// User logout.
userRoute.route("/logout").get(verifyAuth, userLogout);

// Get user details.
userRoute.route("/getUserDetails").get(verifyAuth, getUser);

// Update user's fullname
userRoute.route("/updateFullName").post(verifyAuth, updateUserFullName);

// Update user's password
userRoute.route("/updatePassword").post(verifyAuth, updateUserPassword);

// Delete user account.
userRoute.route("/deleteUserAccount").post(verifyAuth, deleteUserAccount);

// Get new access token.
userRoute.route("/getNewAccessToken").get(getNewAccessToken);

// Forgot password.
userRoute.route("/forgotPassword").post(forgotPassword);

// Reset new password.
userRoute.route("/resetPassword/:resetPasswordToken").post(resetPassword);

export default userRoute;
