import express from "express";
import { z } from "zod";
import { User } from "../models/User.js";
import { hashPassword, signJwt, verifyPassword } from "../shared/auth.js";

export const authRouter = express.Router();

const signupSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(6),
  role: z.enum(["employee", "employer"])
});

authRouter.post("/signup", async (req, res, next) => {
  try {
    const input = signupSchema.parse(req.body);
    const existing = await User.findOne({ email: input.email });
    if (existing) return next(Object.assign(new Error("Email already in use"), { status: 409 }));

    const passwordHash = await hashPassword(input.password);
    const user = await User.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role
    });

    const token = signJwt({ sub: String(user._id), role: user.role });
    return res.json({
      token,
      user: { id: String(user._id), name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    return next(err);
  }
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1)
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body);
    const user = await User.findOne({ email: input.email });
    if (!user) return next(Object.assign(new Error("Invalid credentials"), { status: 401 }));

    const ok = await verifyPassword(input.password, user.passwordHash);
    if (!ok) return next(Object.assign(new Error("Invalid credentials"), { status: 401 }));

    const token = signJwt({ sub: String(user._id), role: user.role });
    return res.json({
      token,
      user: { id: String(user._id), name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    return next(err);
  }
});

