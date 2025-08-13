
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();

// app.use(cors({
//     origin: "https://course-frontend-nu.vercel.app",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//     allowedHeaders: ["Authorization", "Content-Type"]

// }));
app.use(cors())
app.use(express.json());

const UserRoute = require("./Routes/UserRoute");
const AdminRoute = require("./Routes/AdminRoute");
const uploadRoute = require("./Routes/uploadRoutes");
const passwordRoute = require("./Routes/passwordRoute");
const courseRoutes = require("./Routes/courseRoutes");
const videoRoute = require("./Routes/videoRoutes");
const assignmentRoutes = require("./Routes/assignmentRoutes"); // NEW

app.use(express.static("public"));
app.use("/api/user", UserRoute);
app.use("/api/admin", AdminRoute);
app.use("/api/videos", uploadRoute);
app.use("/api/courses", courseRoutes);
app.use("/api/password", passwordRoute);
app.use("/api/secureVideos", videoRoute);
app.use("/api/assignments", assignmentRoutes); // NEW: Use assignment routes

app.get("/", (req, res) => {
    res.send("This backend is running!");
});
// 🔹 Connect to MongoDB (only if not already connected)
mongoose.connect(process.env.MONGODB_URI,
    { dbName: "Course" }).then(() => {
        console.log("Connected to DB");
        app.listen(5000, () => { console.log("App listening on port 5000"); });
    }).catch((error) => {
        console.log("Unable to connect to DB", error);
    });


// ✅ Export app (required for Vercel)
module.exports = app;







