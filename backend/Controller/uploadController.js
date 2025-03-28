const { GetObjectCommand, S3Client, ListObjectsV2Command, DeleteObjectCommand, DeleteObjectsCommand, HeadObjectCommand } = require("@aws-sdk/client-s3");
const Video = require("../Models/Video");
const { getUploadUrl } = require("../services/s3Service");
const Course = require("../Models/Course");

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
        const videos = await Video.find().populate("course", "title") // Populate course name
            .sort({ createdAt: -1 }); // Sort by newest first
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
        const { id } = req.params; // ✅ Video ID from URL
        const { title, courseId } = req.query; // ✅ Extract title & courseId from query
        // 🔹 Find the video record
        const video = await Video.findById(id);
        if (!video) {
            return res.status(404).json({ success: false, message: "Video not found" });
        }

        // 🔹 Find the course and remove the video from its videos array
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // 🔹 Remove the video ID from the course's videos array
        course.videos = course.videos.filter(videoId => videoId.toString() !== id);
        await course.save();

        const bucketName = process.env.AWS_BUCKET_NAME;

        // Extract the object key from the full URL
        const videoKey = video.videoUrl.split('.com/')[1];
        const thumbnailKey = video.thumbnailUrl.split('.com/')[1];
        if (!videoKey || !thumbnailKey) {
            return res.status(400).json({ success: false, message: "Invalid video or thumbnail URL" });
        }
        await Promise.all([
            s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: videoKey })),
            s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: thumbnailKey }))
        ]);


        // 🔹 Delete the video from MongoDB
        await Video.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: `Video "${title}" deleted successfully from course "${course.title}"` });

    } catch (error) {
        console.error("Error deleting video:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


//watch url 
exports.getImageUrl = async (req, res) => {
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



exports.getVideoUrl = async (req, res) => {
    const { filename } = req.query;

    if (!filename) {
        return res.status(400).json({ error: "Filename is required" });
    }

    const bucketName = process.env.AWS_BUCKET_NAME;
    const key = `webdev/${filename}`;

    try {
        // ✅ Get file metadata (Content-Length)
        const { ContentLength } = await s3.send(new HeadObjectCommand({ Bucket: bucketName, Key: key }));

        const range = req.headers.range;
        if (!range) {
            return res.status(400).send("Requires Range header");
        }

        // 🔹 Parse Range header (bytes=start-end)
        const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB per chunk
        const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
        const start = parseInt(startStr, 10);
        const end = endStr ? parseInt(endStr, 10) : Math.min(start + CHUNK_SIZE, ContentLength - 1);
        const contentLength = end - start + 1;

        // 🔹 Get the requested video chunk
        const { Body } = await s3.send(
            new GetObjectCommand({
                Bucket: bucketName,
                Key: key,
                Range: `bytes=${start}-${end}`
            })
        );

        // ✅ Set headers for partial content (206)
        res.writeHead(206, {
            "Content-Range": `bytes ${start}-${end}/${ContentLength}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4"
        });

        // ✅ Stream the chunk
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
};

