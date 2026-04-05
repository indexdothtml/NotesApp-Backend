import mongoose, { type Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StringValue } from "ms";

import { env } from "../envConfig";

type User = {
  fullName: string;
  email: string;
  username: string;
  password: string;
  refreshToken: string;
  resetPasswordToken: string;
  resetPasswordTokenExpiry: number;
};

type UserMethods = {
  checkPassword: (password: string) => Promise<boolean>;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
};

type UserDocument = Document & User & UserMethods;

const userSchema = new mongoose.Schema<UserDocument>(
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
    resetPasswordToken: {
      type: String,
      default: "",
    },
    resetPasswordTokenExpiry: {
      type: Number,
      min: 0,
      default: 0,
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
userSchema.methods.checkPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate access token.
userSchema.methods.generateAccessToken = function () {
  if (!env.accessTokenSecret) {
    return "";
  }

  return jwt.sign(
    {
      _id: this._id,
    },
    env.accessTokenSecret,
    { expiresIn: env.accessTokenExpiry as StringValue },
  );
};

// Method to generate refresh token.
userSchema.methods.generateRefreshToken = function () {
  if (!env.refreshTokenSecret) {
    return "";
  }

  return jwt.sign(
    {
      _id: this._id,
    },
    env.refreshTokenSecret,
    { expiresIn: env.refreshTokenExpiry as StringValue },
  );
};

export const User = mongoose.model<UserDocument>("User", userSchema);
