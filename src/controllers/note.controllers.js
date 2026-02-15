import asyncHandler from "../utils/asyncHandler.utils.js";
import APIErrorResponse from "../utils/apiErrorResponse.utils.js";
import APIResponse from "../utils/apiResponse.utils.js";
import { Note } from "../models/note.models.js";

// Add new note.
const addNewNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  // Validate fields.
  if (
    [title, content].some((field) => !field || field.toString().trim() === "")
  ) {
    return res
      .status(400)
      .json(new APIErrorResponse(400, "Title and Content are required."));
  }

  // Get user id of authenticated user.
  const userId = req?.user?._id;

  if (!userId) {
    return res.status(404).json(new APIErrorResponse(404, "User not found!"));
  }

  // Create new note for user.
  const note = await Note.create({ owner: userId, title, content });

  return res
    .status(201)
    .json(new APIResponse(201, "New note is created.", note));
});

// Get all user's notes.
const getAllUserNotes = asyncHandler(async (req, res) => {
  // Get user id of authenticated user.
  const userId = req?.user?._id;

  if (!userId) {
    return res.status(404).json(new APIErrorResponse(404, "User not found!"));
  }

  // Find all notes.
  const allNotes = await Note.find({ owner: userId });

  return res
    .status(200)
    .json(
      new APIResponse(200, "Fetched all available user's notes.", allNotes),
    );
});

// Delete note.
const deleteNote = asyncHandler(async (req, res) => {
  // Get the note id.
  const { noteId } = req.body;

  // Validate note id.
  if (!noteId) {
    return res
      .status(400)
      .json(new APIErrorResponse(400, "Note id is required."));
  }

  // Delete note.
  const deletedResponse = await Note.findByIdAndDelete(noteId);

  if (!deletedResponse) {
    return res
      .status(404)
      .json(
        new APIErrorResponse(
          404,
          "Note not found, it might be already deleted.",
        ),
      );
  }

  return res
    .status(200)
    .json(new APIResponse(200, "Note is deleted.", deletedResponse));
});

// Update note.
const updateNote = asyncHandler(async (req, res) => {
  // Get new title and content.
  const { noteId, newTitle, newContent } = req.body;

  // Validate note id.
  if (!noteId) {
    return res
      .status(400)
      .json(new APIErrorResponse(400, "Note id is required."));
  }

  // Validate title or content.
  if (
    !(newTitle || newContent) ||
    newTitle?.toString()?.trim() === "" ||
    newContent?.toString()?.trim() === ""
  ) {
    return res
      .status(400)
      .json(new APIErrorResponse(400, "Title or Content is required."));
  }

  // Create update object.
  const updateData = {};

  // Update title if new title is available.
  if (newTitle && newTitle?.toString()?.trim() !== "") {
    updateData.title = newTitle;
  }

  // Update content if new content is available.
  if (newContent && newContent?.toString()?.trim() !== "") {
    updateData.content = newContent;
  }

  // Update title if provided.
  const updatedNote = await Note.findByIdAndUpdate(
    noteId,
    {
      $set: updateData,
    },
    { lean: true, new: true },
  );

  return res
    .status(200)
    .json(new APIResponse(200, "Note is updated.", updatedNote));
});

// Get single note.
const getNote = asyncHandler(async (req, res) => {
  // Get the note id from user.
  const { noteId } = req.body;

  if (!noteId) {
    return res
      .status(400)
      .json(new APIErrorResponse(400, "Note id is required."));
  }

  // Get the note.
  const note = await Note.findById(noteId);

  if (!note) {
    return res.status(404).json(new APIErrorResponse(404, "Note not found."));
  }

  return res
    .status(200)
    .json(new APIResponse(200, "Fetched note successfully.", note));
});

export { addNewNote, getAllUserNotes, deleteNote, updateNote, getNote };
