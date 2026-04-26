import Joi from "joi";

// Validation schema for add new note input fields.
const addNewNoteValidationSchema = Joi.object({
  folderId: Joi.string().required(),
  name: Joi.string().trim().required(),
});

// Validation schema for add new note folder input fields.
const addNewNoteFolderValidationSchema = Joi.object({
  name: Joi.string().trim().required(),
});

// Validation schema for update note name input fields.
const updateNameOfTheNoteValidationSchema = Joi.object({
  noteId: Joi.string().required(),
  name: Joi.string().trim().required(),
});

// Validation schema for update notes folder name input fields.
const updateNotesFolderNameValidationSchema = Joi.object({
  folderId: Joi.string().required(),
  name: Joi.string().trim().required(),
});

// Validation schema for delete note input field.
const deleteNoteValidationSchema = Joi.object({
  noteId: Joi.string().required(),
});

// Validation schema for delete notes folder input field.
const deleteNotesFolderValidationSchema = Joi.object({
  folderId: Joi.string().required(),
});

// Validation schema for get note input field.
const getNoteValidationSchema = Joi.object({
  noteId: Joi.string().required(),
});

// Get all notes preview of selected folder.
const getAllUserNotesPreviewValidationSchema = Joi.object({
  folderId: Joi.string().required(),
});

// Edit note validation schema
const editNoteValidationSchema = Joi.object({
  noteId: Joi.string().required(),
  content: Joi.string().required(),
});

export {
  addNewNoteValidationSchema,
  addNewNoteFolderValidationSchema,
  updateNameOfTheNoteValidationSchema,
  updateNotesFolderNameValidationSchema,
  deleteNoteValidationSchema,
  deleteNotesFolderValidationSchema,
  getNoteValidationSchema,
  getAllUserNotesPreviewValidationSchema,
  editNoteValidationSchema,
};
