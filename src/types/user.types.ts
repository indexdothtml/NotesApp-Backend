import type { Request } from "express";

export type UserData = {
  _id: string;
};

export type RequestWithUser = Request & { user: UserData };
