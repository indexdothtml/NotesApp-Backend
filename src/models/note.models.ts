import mongoose, { type Document, type Types } from "mongoose";

interface NoteDocument extends Document {
  name: string;
  userId: Types.ObjectId;
  folderId: Types.ObjectId;
  content: string;
}

const noteSchema = new mongoose.Schema<NoteDocument>(
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
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NotesFolder",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Note = mongoose.model<NoteDocument>("Note", noteSchema);
