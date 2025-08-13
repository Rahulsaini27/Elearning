// models/AssignmentSubmission.js
const mongoose = require("mongoose");

const AssignmentSubmissionSchema = new mongoose.Schema({
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: true }, // The assignment being submitted
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // The student who submitted
    submissionUrl: { type: String, required: true }, // URL to the student's submitted PDF file
    submissionText: { type: String }, // Optional comments/text from the student
    submittedAt: { type: Date, default: Date.now },
   


      grade: { type: Number, min: 0, max: 100 }, // NEW: Grade (e.g., out of 100)
    feedback: { type: String }, // NEW: Feedback from admin
    gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }, // NEW: Admin who graded it
    gradedAt: { type: Date }, // NEW: Date when it was graded
});

module.exports = mongoose.model("AssignmentSubmission", AssignmentSubmissionSchema);