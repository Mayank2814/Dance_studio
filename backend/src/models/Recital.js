import mongoose from "mongoose";

const recitalSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    mentoringTeachers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }],
    preparationStatus: {
      type: String,
      enum: ["Planned", "In Progress", "Ready"],
      default: "Planned"
    }
  },
  { timestamps: true }
);

export const Recital = mongoose.model("Recital", recitalSchema);


