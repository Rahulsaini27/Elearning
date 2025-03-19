const express = require("express");
const { generateUploadUrls, saveVideo, getAllVideos, deleteVideo, getvideourl, getimageurl } = require("../Controller/uploadController");
const adminMiddleware = require("../Middlewares/AdminAuth");
const UserMiddleware = require("../Middlewares/UserAuth");

const router = express.Router();

router.post("/get-new-upload-url", adminMiddleware, generateUploadUrls);
router.post("/save-video", adminMiddleware, saveVideo);
router.get("/all-video", adminMiddleware || UserMiddleware, getAllVideos);

router.get("/get-video-url", getvideourl);
router.get("/get-image-url", getimageurl);

router.delete("/delete-video/:id", adminMiddleware, deleteVideo);


module.exports = router;
