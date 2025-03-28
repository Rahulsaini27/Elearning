const express = require("express");
const {
    generateUploadUrls,
    saveVideo,
    getCourseVideos,

    getCourseVideosByUser
} = require("../Controller/videoController");
const adminMiddleware = require("../Middlewares/AdminAuth");
const UserMiddleware = require("../Middlewares/UserAuth");

const router = express.Router();

// 🔹 Generate AWS Upload URLs
router.post("/generate-upload-urls", adminMiddleware, generateUploadUrls);

// 🔹 Save Video & Link to Course
router.post("/save", adminMiddleware, saveVideo);

// 🔹 Get Videos of a Course (Only for Enrolled Students)
router.get("/course/:courseId", adminMiddleware, getCourseVideos);

router.get("/course/:courseId/:userId", UserMiddleware, getCourseVideosByUser);

module.exports = router;
