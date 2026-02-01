import { Router } from "express";

import { userRegister } from "../controllers/user.controllers.js";

const userRoute = Router();

// User registeration.
userRoute.route("/register").post(userRegister);

export default userRoute;
