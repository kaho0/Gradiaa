// models/assignmentSchema.js
import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: [true, "Assignment name is required"] 
    },
    details: { 
      type: String, 
      required: [true, "Assignment details are required"] 
    },
    grade: { 
      type: Number, 
      required: [true, "Grade is required"],
      min: [0, "Grade cannot be less than 0"],
      max: [100, "Grade cannot be more than 100"]
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    submissions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission"
    }]
  },
  { timestamps: true }
);

const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment; // ✅ Default Export
