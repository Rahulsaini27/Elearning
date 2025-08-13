const { GetObjectCommand, S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const Video = require("../Models/Video");
const Course = require("../Models/Course");
const { getUploadUrl } = require("../services/s3Service");
const { default: mongoose } = require("mongoose");
const Assignment = require("../Models/Assignment");
const AssignmentSubmission = require("../Models/AssignmentSubmission");

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});


exports.generateUploadUrls = async (req, res) => {
    try {
        const { title, videoType, thumbnailType, assignmentType } = req.body; // NEW: assignmentType

        if (!title || !videoType || !thumbnailType) {
            return res.status(400).json({ success: false, message: "Title, videoType, and thumbnailType are required!" });
        }

        const videoFilename = `${title}.${videoType.split("/")[1]}`;
        const thumbnailFilename = `${title}.${thumbnailType.split("/")[1]}`;

        const videoUploadUrl = await getUploadUrl(videoFilename, videoType);
        const thumbnailUploadUrl = await getUploadUrl(thumbnailFilename, thumbnailType);

        let assignmentUploadUrl = null;
        let assignmentFilename = null;
        if (assignmentType) { // Only generate if assignmentType is provided (optional assignment)
            assignmentFilename = `${title}-assignment.${assignmentType.split("/")[1]}`; // Added -assignment suffix
            assignmentUploadUrl = await getUploadUrl(assignmentFilename, assignmentType);
        }

        res.json({
            success: true,
            video: { url: videoUploadUrl, filename: videoFilename },
            thumbnail: { url: thumbnailUploadUrl, filename: thumbnailFilename },
            assignment: assignmentType ? { url: assignmentUploadUrl, filename: assignmentFilename } : null, // Conditional
        });
    } catch (error) {
        console.error("Error generating upload URLs:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};



// 🔹 Save Video & Link to Course
// exports.saveVideo = async (req, res) => {
//     try {
//         const { title, videoUrl, thumbnailUrl, description, courseId } = req.body;

//         if (!title || !videoUrl || !thumbnailUrl || !description || !courseId) {
//             return res.status(400).json({ success: false, message: "All fields are required!" });
//         }

//         const course = await Course.findById(courseId);
//         if (!course) {
//             return res.status(404).json({ success: false, message: "Course not found" });
//         }

//         // 🔹 Ensure courseId is saved in the video document
//         const newVideo = new Video({ title, videoUrl, thumbnailUrl, description, course: courseId });
//         await newVideo.save();

//         course.videos.push(newVideo._id);
//         await course.save();

//         res.status(201).json({ success: true, message: "Video stored successfully!", video: newVideo });
//     } catch (error) {
//         console.error("Error saving video:", error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };



exports.saveVideo = async (req, res) => {
    try {
        const { title, videoUrl, thumbnailUrl, description, courseId, assignmentUrl, assignmentDescription, assignmentDueDate } = req.body; // NEW: assignment fields

        if (!title || !videoUrl || !thumbnailUrl || !description || !courseId) {
            return res.status(400).json({ success: false, message: "Required fields (title, videoUrl, thumbnailUrl, description, courseId) are missing!" });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // Create new Video document first
        const newVideo = new Video({ title, videoUrl, thumbnailUrl, description, course: courseId });

        // If assignment data is provided, create Assignment document
        let newAssignment = null;
        if (assignmentUrl) { // Only create assignment if a URL is provided
            newAssignment = new Assignment({
                title: `${title} Assignment`, // Default title
                description: assignmentDescription || `Assignment for video "${title}"`,
                assignmentUrl,
                video: newVideo._id, // Link to the new video
                course: courseId, // Link to the course
                dueDate: assignmentDueDate || null, // Optional due date
            });
            await newAssignment.save();
            newVideo.assignment = newAssignment._id; // Link the newly created assignment to the video
        }

        await newVideo.save(); // Save the video after linking the assignment

        course.videos.push(newVideo._id); // Add video to course's videos array
        await course.save();

        res.status(201).json({
            success: true,
            message: "Video and optional assignment stored successfully!",
            video: newVideo,
            assignment: newAssignment, // Return new assignment if created
        });
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







// exports.getCourseVideosByUser = async (req, res) => {
//     try {
//         const { courseId, userId } = req.params;
//         if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(userId)) {
//             return res.status(400).json({ success: false, message: "Invalid courseId or userId" });
//         }

//         const course = await Course.findById(courseId).populate({
//             path: 'videos',
//             populate: {
//                 path: 'assignment' // NEW: Populate the assignment field within each video
//             }
//         });
//         if (!course) {
//             return res.status(404).json({ success: false, message: "Course not found" });
//         }
//         if (!course.assignedStudents.includes(userId)) {
//             return res.status(403).json({ success: false, message: "Access denied: You are not enrolled in this course." });
//         }

//         res.status(200).json({ success: true, videos: course.videos });
//     } catch (error) {
//         console.error("Error fetching course videos:", error);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };
exports.getCourseVideosByUser = async (req, res) => {
    try {
        const { courseId, userId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid courseId or userId" });
        }

        const course = await Course.findById(courseId).populate({
            path: 'videos',
            populate: {
                path: 'assignment' // THIS POPULATES THE ASSIGNMENT DETAILS FOR EACH VIDEO
            }
        });
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        if (!course.assignedStudents.includes(userId)) {
            return res.status(403).json({ success: false, message: "Access denied: You are not enrolled in this course." });
        }

        // --- NEW LOGIC TO CHECK SUBMISSION STATUS ---
        // 1. Get all assignment IDs relevant to these videos
        const assignmentIds = course.videos
            .map(video => video.assignment ? video.assignment._id : null)
            .filter(id => id); // Filter out nulls

        // 2. Fetch all submissions made by this user for these assignments
        const userSubmissions = await AssignmentSubmission.find({
            student: userId,
            assignment: { $in: assignmentIds }
        });

        // 3. Create a map for quick lookup of submissions by assignment ID
        const submissionMap = new Map(); // Key: assignmentId.toString(), Value: submission object
        userSubmissions.forEach(sub => {
            submissionMap.set(sub.assignment.toString(), sub);
        });

        // 4. Augment each video object with its assignment's submission status
        const videosWithStatus = course.videos.map(video => {
            const videoObj = video.toObject(); // Convert Mongoose document to a plain JS object

            if (videoObj.assignment) {
                // Check if this assignment has been submitted by the current user
                const existingSubmission = submissionMap.get(videoObj.assignment._id.toString());
                if (existingSubmission) {
                    videoObj.assignment.submissionStatus = {
                        submitted: true,
                        submissionDetails: { // Include submission URL if needed on frontend
                            _id: existingSubmission._id,
                            submissionUrl: existingSubmission.submissionUrl,
                            submittedAt: existingSubmission.submittedAt,
                        }
                    };
                } else {
                    videoObj.assignment.submissionStatus = { submitted: false };
                }
            }
            return videoObj;
        });
        // --- END NEW LOGIC ---

        res.status(200).json({ success: true, videos: videosWithStatus });
    } catch (error) {
        console.error("Error fetching course videos:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

