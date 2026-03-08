import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

export function signJwt(payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw Object.assign(new Error("Missing JWT_SECRET"), { status: 500 });
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function verifyJwt(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw Object.assign(new Error("Missing JWT_SECRET"), { status: 500 });
  return jwt.verify(token, secret);
}

