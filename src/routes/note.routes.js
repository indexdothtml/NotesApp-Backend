import { Router } from "express";

import verifyAuth from "../middlewares/auth.middlewares.js";
import {
  addNewNote,
  getAllUserNotes,
} from "../controllers/note.controllers.js";

const noteRouter = Router();

// Add new note.
noteRouter.route("/addNewNote").post(verifyAuth, addNewNote);

// Get all user's notes.
noteRouter.route("/getAllNotes").get(verifyAuth, getAllUserNotes);

export default noteRouter;
