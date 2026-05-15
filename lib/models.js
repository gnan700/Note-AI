import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const NoteSchema = new mongoose.Schema({
  user: mongoose.Schema.Types.ObjectId,
  title: String,
  content: String,
}, { timestamps: true });

const TaskSchema = new mongoose.Schema({
  user: mongoose.Schema.Types.ObjectId,
  title: String,
  done: { type: Boolean, default: false },
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
export const Note = mongoose.models.Note || mongoose.model("Note", NoteSchema);
export const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);
