import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true }],
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    room: { type: String },
    status: { type: String, enum: ["scheduled", "cancelled", "completed"], default: "scheduled" }
  },
  { timestamps: true }
);

export const Schedule = mongoose.model("Schedule", scheduleSchema);


