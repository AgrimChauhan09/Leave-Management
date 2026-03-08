import mongoose from "mongoose";

const LeaveRequestSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    leaveType: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true, trim: true },
    status: { type: String, required: true, enum: ["Pending", "Approved", "Rejected"], default: "Pending", index: true },
    reviewedByEmployerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date }
  },
  { timestamps: true }
);

LeaveRequestSchema.index({ employeeId: 1, createdAt: -1 });

export const LeaveRequest =
  mongoose.models.LeaveRequest ?? mongoose.model("LeaveRequest", LeaveRequestSchema);

