
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

require("dotenv").config();

const app = express();

app.use(cors({
    origin: "couser-frontend.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
// app.use(cors())
app.use(express.json());

const UserRoute = require("./Routes/UserRoute");
const AdminRoute = require("./Routes/AdminRoute");
const uploadRoute = require("./Routes/uploadRoutes");
app.use(express.static("public"));
app.use("/api/user", UserRoute);
app.use("/api/admin", AdminRoute);
app.use("/api/videos", uploadRoute);


//WS S3 Configuration
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
app.get("/", async (req, res) => {
    res.send("Hello world, this is the backend");
});
//🔹 Function to Stream Video from S3
app.get("/get-video-url", async (req, res) => {
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
});



app.get("/get-image-url", async (req, res) => {
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
});


// 🔹 Connect to MongoDB and Start the Server
// 🔹 Connect to MongoDB (only if not already connected)
mongoose.connect(process.env.MONGODB_URI,
    {
        dbName: "Course"

    }).then(() => {
        console.log("Connected to DB");
        app.listen(5000, () => {
            console.log("App listening on port 5000");
        });
    }).catch((error) => {
        console.log("Unable to connect to DB", error);
    }
    );


// ✅ Export app (required for Vercel)
module.exports = app;







