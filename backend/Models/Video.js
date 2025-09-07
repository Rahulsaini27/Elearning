const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        videoUrl: { type: String, required: true },
        thumbnailUrl: { type: String, required: true },
        course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true }, 
        order: { type: Number, default: 0 },
        assignment: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }, 
    },
    { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
