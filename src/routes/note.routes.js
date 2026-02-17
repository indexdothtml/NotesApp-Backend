import { Router } from "express";

import {
  addNewNote,
  getAllUserNotes,
  deleteNote,
  updateNote,
  getNote,
} from "../controllers/note.controllers.js";
import {
  addNewNoteValidationSchema,
  deleteNoteValidationSchema,
  updateNoteValidationSchema,
  getNoteValidationSchema,
} from "../validations/note.validations.js";
import validate from "../middlewares/validate.middlewares.js";
import verifyAuth from "../middlewares/auth.middlewares.js";

const noteRouter = Router();

// Add new note.
noteRouter
  .route("/addNewNote")
  .post(verifyAuth, validate(addNewNoteValidationSchema), addNewNote);

// Get all user's notes.
noteRouter.route("/getAllNotes").get(verifyAuth, getAllUserNotes);

// Delete note.
noteRouter
  .route("/deleteNote")
  .post(verifyAuth, validate(deleteNoteValidationSchema), deleteNote);

// Update note.
noteRouter
  .route("/updateNote")
  .post(verifyAuth, validate(updateNoteValidationSchema), updateNote);

// Get note.
noteRouter
  .route("/getNote")
  .post(verifyAuth, validate(getNoteValidationSchema), getNote);

export default noteRouter;
