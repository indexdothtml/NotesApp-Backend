import Joi from "joi";

// Validation schema for add new note input fields.
const addNewNoteValidationSchema = Joi.object({
  title: Joi.string().trim().required(),
  content: Joi.string().trim().required(),
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
  deleteNoteValidationSchema,
  updateNoteValidationSchema,
  getNoteValidationSchema,
};
