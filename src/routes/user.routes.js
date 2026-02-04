import { Router } from "express";

import {
  userRegister,
  userLogin,
  userLogout,
} from "../controllers/user.controllers.js";
import verifyAuth from "../middlewares/auth.middlewares.js";

const userRoute = Router();

// User registeration.
userRoute.route("/register").post(userRegister);

// User login.
userRoute.route("/login").post(userLogin);

// User logout.
userRoute.route("/logout").get(verifyAuth, userLogout);

export default userRoute;
