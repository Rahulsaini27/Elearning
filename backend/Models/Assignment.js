// models/Assignment.js
const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    assignmentUrl: { type: String, required: true }, // URL to the PDF file of the assignment itself
    video: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true }, // Link to the specific video this assignment is for
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true }, // Link to the course this assignment belongs to
    dueDate: { type: Date }, // Optional due date for the assignment
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Assignment", AssignmentSchema);