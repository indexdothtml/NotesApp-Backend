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

// Validation schema for update note input fields.
const updateNoteValidationSchema = Joi.object({
  noteId: Joi.string().required(),
  newTitle: Joi.string().trim(),
  newContent: Joi.string().trim(),
}).or("newTitle", "newContent");

// Validation schema for get note input field.
const getNoteValidationSchema = Joi.object({
  noteId: Joi.string().required(),
});

export {
  addNewNoteValidationSchema,
  addNewNoteFolderValidationSchema,
  updateNameOfTheNoteValidationSchema,
  updateNotesFolderNameValidationSchema,
  deleteNoteValidationSchema,
  updateNoteValidationSchema,
  getNoteValidationSchema,
};
