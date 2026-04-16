import mongoose, { type Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StringValue } from "ms";

import { env } from "../envConfig";

interface UserDocument extends Document {
  name: string;
  email: string;
  isEmailVerified: boolean;
  password: string;
  refreshToken: string;
  checkPassword: (password: string) => Promise<boolean>;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    name: {
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
    isEmailVerified: {
      type: Boolean,
      default: false,
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
