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

export { addNewNote, getAllUserNotes };
