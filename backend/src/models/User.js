import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: ["employee", "employer"], index: true }
  },
  { timestamps: true }
);

export const User = mongoose.models.User ?? mongoose.model("User", UserSchema);

