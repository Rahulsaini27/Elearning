const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    assignmentUrl: { type: String, required: true }, 
    video: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true }, 
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    dueDate: { type: Date }, 
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Assignment", AssignmentSchema);