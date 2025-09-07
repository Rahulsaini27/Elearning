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
        const { title, videoType, thumbnailType, assignmentType } = req.body; 

        if (!title || !videoType || !thumbnailType) {
            return res.status(400).json({ success: false, message: "Title, videoType, and thumbnailType are required!" });
        }

        const videoFilename = `${title}.${videoType.split("/")[1]}`;
        const thumbnailFilename = `${title}.${thumbnailType.split("/")[1]}`;

        const videoUploadUrl = await getUploadUrl(videoFilename, videoType);
        const thumbnailUploadUrl = await getUploadUrl(thumbnailFilename, thumbnailType);

        let assignmentUploadUrl = null;
        let assignmentFilename = null;
        if (assignmentType) { 
            assignmentFilename = `${title}-assignment.${assignmentType.split("/")[1]}`; 
            assignmentUploadUrl = await getUploadUrl(assignmentFilename, assignmentType);
        }

        res.json({
            success: true,
            video: { url: videoUploadUrl, filename: videoFilename },
            thumbnail: { url: thumbnailUploadUrl, filename: thumbnailFilename },
            assignment: assignmentType ? { url: assignmentUploadUrl, filename: assignmentFilename } : null, 
        });
    } catch (error) {
        console.error("Error generating upload URLs:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};



//  Save Video & Link to Course
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

//         //  Ensure courseId is saved in the video document
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
                video: newVideo._id, 
                course: courseId, 
                dueDate: assignmentDueDate || null, 
            });
            await newAssignment.save();
            newVideo.assignment = newAssignment._id; 
        }

        await newVideo.save(); 

        course.videos.push(newVideo._id);
        await course.save();

        res.status(201).json({
            success: true,
            message: "Video and optional assignment stored successfully!",
            video: newVideo,
            assignment: newAssignment, 
        });
    } catch (error) {
        console.error("Error saving video:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
// Get Videos of a Course (Only for Enrolled Students)
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
                path: 'assignment' 
            }
        });
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        if (!course.assignedStudents.includes(userId)) {
            return res.status(403).json({ success: false, message: "Access denied: You are not enrolled in this course." });
        }

     
        const assignmentIds = course.videos
            .map(video => video.assignment ? video.assignment._id : null)
            .filter(id => id); 


            const userSubmissions = await AssignmentSubmission.find({
            student: userId,
            assignment: { $in: assignmentIds }
        });

        const submissionMap = new Map();
        userSubmissions.forEach(sub => {
            submissionMap.set(sub.assignment.toString(), sub);
        });


        const videosWithStatus = course.videos.map(video => {
            const videoObj = video.toObject(); 

            if (videoObj.assignment) {

                const existingSubmission = submissionMap.get(videoObj.assignment._id.toString());
                if (existingSubmission) {
                    videoObj.assignment.submissionStatus = {
                        submitted: true,
                        submissionDetails: {
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
        

        res.status(200).json({ success: true, videos: videosWithStatus });
    } catch (error) {
        console.error("Error fetching course videos:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

