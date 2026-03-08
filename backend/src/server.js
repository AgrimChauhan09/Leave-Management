import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

import { connectToMongo } from "./shared/db.js";
import { authRouter } from "./routes/auth.js";
import { leavesRouter } from "./routes/leaves.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env");
const dotenvResult = dotenv.config({ override: true, path: envPath });
if (dotenvResult.error) {
  // eslint-disable-next-line no-console
  console.error("Failed to load .env", dotenvResult.error);
}

function maskMongoUri(uri) {
  if (!uri) return "";
  try {
    const at = uri.indexOf("@");
    if (uri.startsWith("mongodb+srv://") && at > 0) {
      return `mongodb+srv://***:***${uri.slice(at)}`;
    }
    return uri.replace(/:\/\/.*@/, "://***:***@");
  } catch {
    return "<unprintable>";
  }
}

// eslint-disable-next-line no-console
console.log("MONGODB_URI =", maskMongoUri(process.env.MONGODB_URI));
try {
  const raw = fs.readFileSync(envPath, "utf8");
  const line = raw.split(/\r?\n/).find((l) => l.startsWith("MONGODB_URI=")) ?? "";
  // eslint-disable-next-line no-console
  console.log("ENV file:", envPath, "exists =", fs.existsSync(envPath), "MONGODB_URI line =", maskMongoUri(line.split("=", 2)[1] ?? ""));
} catch (e) {
  // eslint-disable-next-line no-console
  console.log("ENV file read failed:", envPath, String(e?.message ?? e));
}

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN
      ? process.env.CLIENT_ORIGIN.split(",").map((s) => s.trim())
      : true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter);
app.use("/api/leaves", leavesRouter);

app.use((err, _req, res, _next) => {
  const isZod =
    err?.name === "ZodError" ||
    (Array.isArray(err?.issues) && typeof err?.issues?.[0]?.message === "string");
  if (isZod) {
    const message = err.issues?.[0]?.message ?? "Invalid input";
    return res.status(400).json({ error: message, issues: err.issues ?? [] });
  }

  const status = err?.status ?? 500;
  const message = err?.message ?? "Internal Server Error";
  return res.status(status).json({ error: message });
});

const port = Number(process.env.PORT ?? 8080);
await connectToMongo(process.env.MONGODB_URI);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on :${port}`);
});

