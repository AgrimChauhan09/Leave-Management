import express from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { LeaveRequest } from "../models/LeaveRequest.js";

export const leavesRouter = express.Router();

leavesRouter.use(requireAuth);

const applySchema = z
  .object({
    leaveType: z.string().trim().min(1),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    reason: z.string().trim().min(1)
  })
  .refine((v) => !Number.isNaN(Date.parse(v.startDate)), { message: "Invalid startDate", path: ["startDate"] })
  .refine((v) => !Number.isNaN(Date.parse(v.endDate)), { message: "Invalid endDate", path: ["endDate"] })
  .refine((v) => new Date(v.startDate) <= new Date(v.endDate), { message: "startDate must be <= endDate" });

// Employee: create a leave request
leavesRouter.post("/", requireRole("employee"), async (req, res, next) => {
  try {
    const input = applySchema.parse(req.body);
    const doc = await LeaveRequest.create({
      employeeId: req.user.id,
      leaveType: input.leaveType,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
      reason: input.reason
    });
    return res.status(201).json(doc);
  } catch (err) {
    return next(err);
  }
});

// Employee: list my leave requests
leavesRouter.get("/mine", requireRole("employee"), async (req, res, next) => {
  try {
    const docs = await LeaveRequest.find({ employeeId: req.user.id }).sort({ createdAt: -1 });
    return res.json(docs);
  } catch (err) {
    return next(err);
  }
});

// Employer: list all leave requests (with employee info)
leavesRouter.get("/", requireRole("employer"), async (_req, res, next) => {
  try {
    const docs = await LeaveRequest.find({})
      .populate("employeeId", "name email role")
      .sort({ createdAt: -1 });
    return res.json(docs);
  } catch (err) {
    return next(err);
  }
});

const reviewSchema = z.object({
  status: z.enum(["Approved", "Rejected"])
});

// Employer: approve/reject a request
leavesRouter.patch("/:id/status", requireRole("employer"), async (req, res, next) => {
  try {
    const { status } = reviewSchema.parse(req.body);
    const updated = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { status, reviewedByEmployerId: req.user.id, reviewedAt: new Date() },
      { new: true }
    ).populate("employeeId", "name email role");

    if (!updated) return next(Object.assign(new Error("Not found"), { status: 404 }));
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
});

