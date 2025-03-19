const { GetObjectCommand, S3Client, ListObjectsV2Command, DeleteObjectCommand, DeleteObjectsCommand } = require("@aws-sdk/client-s3");
const Video = require("../Models/Video");
const { getUploadUrl } = require("../services/s3Service");

exports.generateUploadUrls = async (req, res) => {
    try {
        const { title, videoType, thumbnailType } = req.body;

        if (!title || !videoType || !thumbnailType) {
            return res.status(400).json({ success: false, message: "Title, videoType, and thumbnailType are required!" });
        }

        // Generate filenames
        const videoFilename = `${title}.${videoType.split("/")[1]}`;
        const thumbnailFilename = `${title}.${thumbnailType.split("/")[1]}`;

        // Generate upload URLs
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

exports.saveVideo = async (req, res) => {
    try {
        const { title, videoUrl, thumbnailUrl, description } = req.body;

        if (!title || !videoUrl || !thumbnailUrl || !description) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        const newVideo = new Video({ title, videoUrl, thumbnailUrl, description });
        await newVideo.save();

        res.status(201).json({ success: true, message: "Video stored successfully!", video: newVideo });
    } catch (error) {
        console.error("Error saving video:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};



exports.getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find().sort({ createdAt: -1 }); // Get all videos, sorted by newest first
        res.status(200).json({ success: true, videos });
    } catch (error) {
        console.error("Error fetching videos:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});


exports.deleteVideo = async (req, res) => {
    try {
        const { id } = req.params; // Video ID from URL
        const { title } = req.query; // Extract additional parameters from query string


        // 🔹 Find the video record
        const video = await Video.findById(id);
        if (!video) {
            return res.status(404).json({ success: false, message: "Video not found" });
        }

        const bucketName = process.env.AWS_BUCKET_NAME;
        const videoKey = video.videoUrl.split(".com/")[1];
        const thumbnailKey = video.thumbnailUrl.split(".com/")[1];

        // 🔹 Delete video and thumbnail from S3
        await Promise.all([
            s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: videoKey })),
            s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: thumbnailKey }))
        ]);

        // 🔹 Delete the video from MongoDB
        await Video.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: `Video "${title}" ` });

    } catch (error) {
        console.error("Error deleting video:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

//watch url 
exports.getimageurl = async (req , res )=>{
    const { filename } = req.query;
    
        if (!filename) {
            return res.status(400).json({ error: "Filename is required" });
        }
    
        const bucketName = process.env.AWS_BUCKET_NAME;
        const key = `webdev/${filename}`;
    
        try {
    
            // 🔹 Get S3 object (image)
            const { Body, ContentType, ContentLength } = await s3.send(
                new GetObjectCommand({
                    Bucket: bucketName,
                    Key: key
                })
            );
    
            res.setHeader("Content-Type", ContentType || "image/jpeg"); // Default to JPEG
            res.setHeader("Accept-Ranges", "bytes");
            res.setHeader("Content-Length", ContentLength);
    
            // ✅ Pipe the image stream directly
            Body.pipe(res);
    
            Body.on("error", (err) => {
                console.error("Error streaming image:", err);
                if (!res.headersSent) {
                    res.status(500).end();
                }
            });
    
        } catch (error) {
            console.error("Error fetching image:", error);
            if (!res.headersSent) {
                return res.status(500).json({ error: "Internal Server Error" });
            }
        }
}



exports.getvideourl = async (req, res) => {
    const { filename } = req.query;

    if (!filename) {
        return res.status(400).json({ error: "Filename is required" });
    }

    const bucketName = process.env.AWS_BUCKET_NAME;
    const key = `webdev/${filename}`;

    try {

        // 🔹 Correct way to get S3 object
        const { Body, ContentLength } = await s3.send(
            new GetObjectCommand({
                Bucket: bucketName,
                Key: key
            })
        );

        res.setHeader("Content-Type", "video/mp4");
        res.setHeader("Accept-Ranges", "bytes");
        res.setHeader("Content-Length", ContentLength);


        // ✅ Pipe the video stream directly
        Body.pipe(res);

        Body.on("error", (err) => {
            console.error("Error streaming video:", err);
            if (!res.headersSent) {
                res.status(500).end();
            }
        });

    } catch (error) {
        console.error("Error fetching video:", error);
        if (!res.headersSent) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}