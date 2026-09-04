import mongoose from "mongoose";
import { ROLES } from "../utils/roles.js";

const teacherSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    danceStyles: [{ type: String }],
    bio: { type: String },
    salaryType: { type: String, enum: ["monthly", "per_class", "fixed"], default: "monthly" },
    salaryAmount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Teacher = mongoose.model("Teacher", teacherSchema);


