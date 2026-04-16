import type { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler.utils";
import { APIErrorResponse } from "../utils/apiErrorResponse.utils";
import { APIResponse } from "../utils/apiResponse.utils";
import { Note } from "../models/note.models";
import { User } from "../models/user.models";
import { NotesFolder } from "../models/notesFolder.models";
import { logger } from "../loggerConfig";

// Add new note.
const addNewNote = asyncHandler(
  async (request: Request, response: Response) => {
    const { folderId, name } = request.body;

    // Get user id of authenticated user.
    const userId = request.user?._id;

    // Check if user exist.
    const user = await User.findById(userId).exec();

    if (!user) {
      return response
        .status(404)
        .json(new APIErrorResponse(404, "User not found!"));
    }

    // Create new note for user.
    const newNote = await Note.create({
      name,
      userId,
      folderId,
      content: "",
    });

    // Validate if new note is created.
    const note = await Note.findById(newNote._id).exec();

    if (!note) {
      logger.error("Failed to create new note.");
      return response
        .status(500)
        .json(new APIErrorResponse(500, "Failed to create new note."));
    }

    return response
      .status(201)
      .json(new APIResponse(201, "New note is created.", note));
  },
);

// Add new note folder.
const addNewNoteFolder = asyncHandler(
  async (request: Request, response: Response) => {
    const { name } = request.body;

    const userId = request.user?._id;

    // Check if user is available with given id.
    const user = await User.findById(userId).exec();

    if (!user) {
      return response
        .status(404)
        .json(new APIErrorResponse(404, "User does not exist."));
    }

    // Create new notes folder.
    const newNotesFolder = await NotesFolder.create({
      name,
      userId,
      notes: [],
    });

    // Check if new notes folder is created or not.
    const notesFolder = await NotesFolder.findById(newNotesFolder._id).exec();

    if (!notesFolder) {
      logger.error("Failed to create new notes folder.");
      return response
        .status(500)
        .json(new APIErrorResponse(500, "Failed to create new notes folder."));
    }

    return response
      .status(201)
      .json(new APIResponse(201, "New notes folder is created.", notesFolder));
  },
);

// Update note name.
const updateNameOfTheNote = asyncHandler(
  async (request: Request, response: Response) => {
    const { noteId, name } = request.body;

    const userId = request.user?._id;

    // Check if user exist.
    const user = await User.findById(userId).exec();

    if (!user) {
      return response
        .status(404)
        .json(new APIErrorResponse(404, "User does not exist."));
    }

    // Find note and update its name.
    const updatedNoteName = await Note.findOneAndUpdate(
      {
        $and: [{ _id: noteId }, { userId }],
      },
      {
        $set: { name },
      },
      {
        new: true,
      },
    )
      .select("-content")
      .exec();

    // Check if it is updated
    if (!updatedNoteName) {
      return response
        .status(500)
        .json(new APIErrorResponse(500, "Failed to update notes name."));
    }

    return response
      .status(200)
      .json(new APIResponse(200, "Note name is updated.", updatedNoteName));
  },
);

// Update notes folder name.
const updateNotesFolderName = asyncHandler(
  async (request: Request, response: Response) => {
    const { folderId, name } = request.body;

    const userId = request.user?._id;

    // Check if user is exist.
    const user = await User.findById(userId).exec();

    if (!user) {
      return response
        .status(404)
        .json(new APIErrorResponse(404, "User does not exist."));
    }

    // Update folder name.
    const updatedFolderName = await NotesFolder.findOneAndUpdate(
      {
        $and: [{ _id: folderId }, { userId }],
      },
      {
        $set: { name },
      },
      {
        new: true,
      },
    )
      .select("-notes")
      .exec();

    // Check if folder is updated.
    if (!updatedFolderName) {
      logger.error("Failed to update folder name.");
      return response
        .status(500)
        .json(new APIErrorResponse(500, "Failed to update folder name."));
    }

    return response
      .status(200)
      .json(new APIResponse(200, "Folder name is updated.", updatedFolderName));
  },
);

// Delete note.
const deleteNote = asyncHandler(
  async (request: Request, response: Response) => {
    const { noteId } = request.body;

    const userId = request.user?._id;

    // Check if user exist.
    const user = await User.findById(userId).exec();

    if (!user) {
      return response
        .status(404)
        .json(new APIErrorResponse(404, "User does not exist."));
    }

    // Delete the note.
    const deletedNote = await Note.findOneAndDelete({
      $and: [{ _id: noteId }, { userId }],
    }).exec();

    // Check if it is deleted.
    if (!deletedNote) {
      return response
        .status(404)
        .json(new APIErrorResponse(404, "Note does not exist."));
    }

    return response
      .status(200)
      .json(new APIResponse(200, "Note is deleted.", deleteNote));
  },
);

// // Get all user's notes.
// const getAllUserNotes = asyncHandler(async (req, res) => {
//   // Get user id of authenticated user.
//   const userId = req?.user?._id;

//   if (!userId) {
//     return res.status(404).json(new APIErrorResponse(404, "User not found!"));
//   }

//   // Find all notes.
//   const allNotes = await Note.find({ owner: userId });

//   return res
//     .status(200)
//     .json(
//       new APIResponse(200, "Fetched all available user's notes.", allNotes),
//     );
// });

// // Update note.
// const updateNote = asyncHandler(async (req, res) => {
//   // Get new title and content.
//   const { noteId, newTitle, newContent } = req.body;

//   // Create update object.
//   const updateData = {};

//   // Update title if new title is available.
//   if (newTitle && newTitle?.toString()?.trim() !== "") {
//     updateData.title = newTitle;
//   }

//   // Update content if new content is available.
//   if (newContent && newContent?.toString()?.trim() !== "") {
//     updateData.content = newContent;
//   }

//   // Update title if provided.
//   const updatedNote = await Note.findByIdAndUpdate(
//     noteId,
//     {
//       $set: updateData,
//     },
//     { lean: true, new: true },
//   );

//   return res
//     .status(200)
//     .json(new APIResponse(200, "Note is updated.", updatedNote));
// });

// // Get single note.
// const getNote = asyncHandler(async (req, res) => {
//   // Get the note id from user.
//   const { noteId } = req.body;

//   // Get the note.
//   const note = await Note.findById(noteId);

//   if (!note) {
//     return res.status(404).json(new APIErrorResponse(404, "Note not found."));
//   }

//   return res
//     .status(200)
//     .json(new APIResponse(200, "Fetched note successfully.", note));
// });

export {
  addNewNote,
  addNewNoteFolder,
  updateNameOfTheNote,
  updateNotesFolderName,
  deleteNote,
  // getAllUserNotes,
  // updateNote,
  // getNote,
};
