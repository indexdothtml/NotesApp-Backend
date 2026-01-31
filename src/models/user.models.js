import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import env from "../envConfig.js";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

// Encrypt the password before save.
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// Check password method.
userSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate access token.
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    env.accessTokenSecret,
    { expiresIn: env.accessTokenExpiry },
  );
};

// Method to generate refresh token.
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    env.refreshTokenSecret,
    { expiresIn: env.refreshTokenExpiry },
  );
};

export const User = mongoose.model("User", userSchema);
