import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    assignedTeacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    instrument: { type: String },
    courseLevel: { type: String }
  },
  { timestamps: true }
);

export const Student = mongoose.model("Student", studentSchema);


