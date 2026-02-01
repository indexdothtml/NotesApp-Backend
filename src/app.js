import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { corsOptions } from "./constant.js";
import appError from "./middlewares/error.middlewares.js";

const app = express();

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Routes middlewares
import userRoute from "./routes/user.routes.js";

// User route
app.use("/api/v1/user", userRoute);

// App error handler middleware
app.use(appError);

export default app;
