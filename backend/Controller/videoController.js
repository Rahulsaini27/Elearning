const { GetObjectCommand, S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const Video = require("../Models/Video");
const Course = require("../Models/Course");
const { getUploadUrl } = require("../services/s3Service");
const { default: mongoose } = require("mongoose");

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// 🔹 Generate AWS Upload URLs
exports.generateUploadUrls = async (req, res) => {
    try {
        const { title, videoType, thumbnailType } = req.body;

        if (!title || !videoType || !thumbnailType) {
            return res.status(400).json({ success: false, message: "Title, videoType, and thumbnailType are required!" });
        }

        const videoFilename = `${title}.${videoType.split("/")[1]}`;
        const thumbnailFilename = `${title}.${thumbnailType.split("/")[1]}`;

        const videoUploadUrl = await getUploadUrl(videoFilename, videoType);
        const thumbnailUploadUrl = await getUploadUrl(thumbnailFilename, thumbnailType);
        res.json({
            success: true,
            video: { url: videoUploadUrl, filename: videoFilename },
            thumbnail: { url: thumbnailUploadUrl, filename: thumbnailFilename },
        });
    } catch (error) {
        console.error("Error generating upload URLs:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
// 🔹 Save Video & Link to Course
exports.saveVideo = async (req, res) => {
    try {
        const { title, videoUrl, thumbnailUrl, description, courseId } = req.body;

        if (!title || !videoUrl || !thumbnailUrl || !description || !courseId) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // 🔹 Ensure courseId is saved in the video document
        const newVideo = new Video({ title, videoUrl, thumbnailUrl, description, course: courseId });
        await newVideo.save();

        course.videos.push(newVideo._id);
        await course.save();

        res.status(201).json({ success: true, message: "Video stored successfully!", video: newVideo });
    } catch (error) {
        console.error("Error saving video:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
// 🔹 Get Videos of a Course (Only for Enrolled Students)
exports.getCourseVideos = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId).populate("videos");
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        res.status(200).json({ success: true, videos: course.videos });
    } catch (error) {
        console.error("Error fetching course videos:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
exports.getCourseVideosByUser = async (req, res) => {
    try {

        const { courseId, userId } = req.params;  // Extract userId from params
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid courseId or userId" });
        }

        const course = await Course.findById(courseId).populate("videos");
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        // Check if the user is enrolled
        if (!course.assignedStudents.includes(userId)) {
            return res.status(403).json({ success: false, message: "Access denied: You are not enrolled in this course." });
        }

        res.status(200).json({ success: true, videos: course.videos });
    } catch (error) {
        console.error("Error fetching course videos:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
