import mongoose from "mongoose";

export async function connectToMongo(uri) {
  if (!uri) {
    throw Object.assign(new Error("Missing MONGODB_URI"), { status: 500 });
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
}

