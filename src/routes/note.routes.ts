import { Router } from "express";

import {
  addNewNote,
  addNewNoteFolder,
  updateNameOfTheNote,
  updateNotesFolderName,
  deleteNote,
  deleteNotesFolder,
  getNote,
  getAllUserNotesPreview,
  getAllFolders,
  editNote,
} from "../controllers/note.controllers";
import {
  addNewNoteValidationSchema,
  addNewNoteFolderValidationSchema,
  updateNameOfTheNoteValidationSchema,
  updateNotesFolderNameValidationSchema,
  deleteNoteValidationSchema,
  deleteNotesFolderValidationSchema,
  getNoteValidationSchema,
  getAllUserNotesPreviewValidationSchema,
  editNoteValidationSchema,
} from "../validations/note.validations";
import { validate } from "../middlewares/validate.middlewares";
import { verifyAuth } from "../middlewares/auth.middlewares";

const noteRouter = Router();

noteRouter.use(verifyAuth);

// Add new note.
noteRouter
  .route("/addNewNote")
  .post(validate(addNewNoteValidationSchema), addNewNote);

// Add new note folder.
noteRouter
  .route("/addNewNoteFolder")
  .post(validate(addNewNoteFolderValidationSchema), addNewNoteFolder);

// Update name of the note.
noteRouter
  .route("/updateNoteName")
  .patch(validate(updateNameOfTheNoteValidationSchema), updateNameOfTheNote);

// Update name of the note folder.
noteRouter
  .route("/updateFolderName")
  .patch(
    validate(updateNotesFolderNameValidationSchema),
    updateNotesFolderName,
  );

// Delete note.
noteRouter
  .route("/deleteNote")
  .delete(validate(deleteNoteValidationSchema), deleteNote);

// Delete note folder.
noteRouter
  .route("/deleteNoteFolder")
  .delete(validate(deleteNotesFolderValidationSchema), deleteNotesFolder);

// Get Note
noteRouter.route("/getNote").post(validate(getNoteValidationSchema), getNote);

// Get all user's notes preview.
noteRouter
  .route("/getAllNotesPreview")
  .post(
    validate(getAllUserNotesPreviewValidationSchema),
    getAllUserNotesPreview,
  );

// Get all folders
noteRouter.route("/getFolders").get(getAllFolders);

// Edit note.
noteRouter
  .route("/editNote")
  .patch(validate(editNoteValidationSchema), editNote);

export default noteRouter;
