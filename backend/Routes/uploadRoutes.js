const express = require("express");
const { generateUploadUrls, saveVideo, getAllVideos, deleteVideo } = require("../Controller/uploadController");

const router = express.Router();

router.post("/get-new-upload-url", generateUploadUrls);
router.post("/save-video", saveVideo);
router.get("/all-video", getAllVideos);

router.delete("/delete-video/:id", deleteVideo);


module.exports = router;
