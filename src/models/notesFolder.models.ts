import mongoose, { type Document, type Types } from "mongoose";

interface NotesFolderDocument extends Document {
  name: string;
  userId: Types.ObjectId;
  notes: Types.ObjectId[];
}

const notesFolderSchema = new mongoose.Schema<NotesFolderDocument>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
  },
  { timestamps: true },
);

export const NotesFolder = mongoose.model<NotesFolderDocument>(
  "NotesFolder",
  notesFolderSchema,
);
