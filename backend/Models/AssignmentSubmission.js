const mongoose = require("mongoose");

const AssignmentSubmissionSchema = new mongoose.Schema({
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    submissionUrl: { type: String, required: true }, 
    submissionText: { type: String }, 
    submittedAt: { type: Date, default: Date.now },
   


      grade: { type: Number, min: 0, max: 100 },
    feedback: { type: String }, 
    gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    gradedAt: { type: Date },
});

module.exports = mongoose.model("AssignmentSubmission", AssignmentSubmissionSchema);