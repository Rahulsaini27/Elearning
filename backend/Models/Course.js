const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    lessons: { type: Number, default: 0 },
    category: { type: String },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }], 
    assignedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    price: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    language: { type: String, default: "English" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);
