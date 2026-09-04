import mongoose from "mongoose";

const salarySchema = new mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    period: { type: String, required: true }, // e.g. "2025-01" or "2025-Q1"
    type: { type: String, enum: ["monthly", "per_class", "fixed"], required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["Credited", "Not Credited"], default: "Not Credited" }
  },
  { timestamps: true }
);

export const Salary = mongoose.model("Salary", salarySchema);


