import mongoose from "mongoose";

const practiceLogSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    date: { type: Date, required: true },
    durationMinutes: { type: Number, required: true },
    notes: { type: String },
    teacherFeedback: { type: String },
    feedbackGivenAt: { type: Date }
  },
  { timestamps: true }
);

export const PracticeLog = mongoose.model("PracticeLog", practiceLogSchema);


