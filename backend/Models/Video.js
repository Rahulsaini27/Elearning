const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        videoUrl: { type: String, required: true },
        thumbnailUrl: { type: String, required: true },
        course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true }, // Ensure courseId is required
        order: { type: Number, default: 0 }, // Order of the video in the course
        assignment: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }, // NEW: Link to the assignment for this video

    },
    { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
