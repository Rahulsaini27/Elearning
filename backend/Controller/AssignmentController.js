// Controller/AssignmentController.js (NEW FILE)
const Assignment = require("../Models/Assignment");
const AssignmentSubmission = require("../Models/AssignmentSubmission");
const { getUploadUrl, s3 } = require("../services/s3Service"); // Re-use S3 service, import s3 client for getObject
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const mongoose = require('mongoose');
const Course = require("../Models/Course"); // Add this
const User = require("../Models/UserModel"); // Add this

const { GoogleGenerativeAI } = require("@google/generative-ai");
const PDFDocument = require('pdfkit'); // For PDF generation
// END NEW IMPORTS

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- CORRECTED: Directly initialize a specific, free-tier compatible model ---
let textGenModel;
try {
    // gemini-1.5-flash is a powerful and cost-effective model suitable for the free tier.
    textGenModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
} catch (error) {
    console.error("CRITICAL: Failed to initialize Gemini AI. Please check your API key and project setup.", error);
    // Set model to null so that any attempts to use it will fail gracefully.
    textGenModel = null;
}

// Student API: Generate upload URL for submission PDF


exports.generateSubmissionUploadUrl = async (req, res) => {
    try {
        const { assignmentId, submissionFileType } = req.body;
        const { userId } = req.user; // from UserAuth middleware

        if (!assignmentId || !submissionFileType || !userId) {
            return res.status(400).json({ success: false, message: "Assignment ID, file type, and user ID are required." });
        }

        if (!mongoose.Types.ObjectId.isValid(assignmentId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid assignment or user ID." });
        }

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ success: false, message: "Assignment not found." });
        }

        // File path in S3: submissions/{userId}-{assignmentId}-{timestamp}.{ext}
        const extension = submissionFileType.split("/")[1];
        const submissionFilename = `submissions/${userId}-${assignmentId}-${Date.now()}.${extension}`;

        // Presigned URL for upload
        const submissionUploadUrl = await getUploadUrl(submissionFilename, submissionFileType);

        // Public final URL
        const finalUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${submissionFilename}`;

        res.status(200).json({
            success: true,
            message: "Upload URL generated successfully.",
            uploadUrl: submissionUploadUrl,
            filename: submissionFilename,
            finalUrl, // ✅ Sent to frontend so no env vars needed there
        });

    } catch (error) {
        console.error("Error generating submission upload URL:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.saveSubmission = async (req, res) => {
    try {
        const { assignmentId, submissionUrl, submissionText } = req.body;
        const { userId } = req.user; // from UserAuth middleware

        if (!assignmentId || !submissionUrl || !userId) {
            return res.status(400).json({ success: false, message: "Assignment ID, submission URL, and user ID are required." });
        }

        const newSubmission = new AssignmentSubmission({
            assignment: assignmentId,
            student: userId,
            submissionUrl,
            submissionText,
        });

        await newSubmission.save();

        res.status(201).json({ success: true, message: "Assignment submitted successfully!", submission: newSubmission });

    } catch (error) {
        console.error("Error saving assignment submission:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin API: Get all submissions for a specific assignment
exports.getAssignmentSubmissions = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
            return res.status(400).json({ success: false, message: "Invalid assignment ID." });
        }

        const submissions = await AssignmentSubmission.find({ assignment: assignmentId })
            .populate('student', 'name email') // Populate student details
            .sort({ submittedAt: -1 });

        res.status(200).json({ success: true, submissions });

    } catch (error) {
        console.error("Error fetching assignment submissions:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};



exports.getSubmittedFile = async (req, res) => {
    const { filename } = req.query; // e.g., submissions/studentId-assignmentId-timestamp.pdf or .zip

    if (!filename) {
        return res.status(400).json({ error: "Filename is required" });
    }

    const bucketName = process.env.AWS_BUCKET_NAME;
    // const key = `webdev/${filename}`; // Assuming submissions are also stored in 'webdev/' prefix
    const key = filename; // <-- NEW, CORRECT LINE: Use the filename directly as it already includes the 'submissions/' prefix

    try {
        const { Body, ContentType, ContentLength } = await s3.send(
            new GetObjectCommand({ Bucket: bucketName, Key: key })
        );

        res.setHeader("Content-Type", ContentType || "application/octet-stream"); // Default to octet-stream for unknown types
        res.setHeader("Content-Length", ContentLength);

        // Determine content disposition based on content type
        let disposition = "inline"; // Default for PDFs, images, etc.
        if (ContentType === "application/zip") {
            disposition = "attachment"; // Force download for ZIP files
        } else if (ContentType && ContentType.startsWith("image/")) {
            disposition = "inline"; // Keep inline for images
        } else if (ContentType === "application/pdf") {
            disposition = "inline"; // Keep inline for PDFs
        }
        res.setHeader("Content-Disposition", `${disposition}; filename="${filename.split('/').pop()}"`);

        Body.pipe(res);

        Body.on("error", (err) => {
            console.error("Error streaming submitted file:", err);
            if (!res.headersSent) {
                res.status(500).end();
            }
        });
    } catch (error) {
        console.error("Error fetching submitted file:", error);
        if (!res.headersSent) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
};




exports.getAdminAssignmentOverview = async (req, res) => {
    try {
        // Fetch all relevant data efficiently
        const [allAssignments, allSubmissions, allCourses, allUsers] = await Promise.all([
            Assignment.find().populate('video', 'title').populate('course', 'title assignedStudents'),
            AssignmentSubmission.find().populate('student', 'name email').populate('assignment', 'title video course'),
            Course.find().select('title assignedStudents').populate('assignedStudents', 'name email'),
            User.find().select('name email enrolledCourses')
        ]);

        // Map for quick lookup of submissions by assignment and student
        const submissionMap = new Map(); // Key: `${assignmentId}-${studentId}`, Value: submission object
        allSubmissions.forEach(sub => {
            if (sub.assignment && sub.student) {
                submissionMap.set(`${sub.assignment._id.toString()}-${sub.student._id.toString()}`, sub);
            }
        });

        // Map for quick lookup of course assigned students
        const courseStudentMap = new Map(); // Key: courseId, Value: Array of student objects
        allCourses.forEach(course => {
            courseStudentMap.set(course._id.toString(), course.assignedStudents || []);
        });

        const overview = [];

        // Iterate through each assignment to build the detailed status
        for (const assignment of allAssignments) {
            const assignmentInfo = {
                _id: assignment._id,
                title: assignment.title,
                description: assignment.description,
                assignmentUrl: assignment.assignmentUrl,
                videoTitle: assignment.video ? assignment.video.title : 'N/A',
                course: assignment.course ? {
                    _id: assignment.course._id,
                    title: assignment.course.title
                } : null,
                dueDate: assignment.dueDate,
                studentStatuses: [] // To hold submission status for each relevant student
            };

            const studentsAssignedToCourse = courseStudentMap.get(assignment.course?._id?.toString());

            if (studentsAssignedToCourse && studentsAssignedToCourse.length > 0) {
                for (const student of studentsAssignedToCourse) {
                    const submissionKey = `${assignment._id.toString()}-${student._id.toString()}`;
                    const submission = submissionMap.get(submissionKey);

                    assignmentInfo.studentStatuses.push({
                        studentId: student._id,
                        studentName: student.name,
                        studentEmail: student.email,
                        submitted: !!submission, // True if submission exists
                        submissionDetails: submission ? {
                            _id: submission._id,
                            submissionUrl: submission.submissionUrl,
                            submissionText: submission.submissionText,
                            submittedAt: submission.submittedAt,
                        } : null,
                    });
                }
            } else {
                // If no students assigned to the course, log or handle as per policy.
                // For now, it means no one is expected to submit.
            }
            overview.push(assignmentInfo);
        }

        res.status(200).json({ success: true, assignmentsOverview: overview });

    } catch (error) {
        console.error("Error fetching admin assignment overview:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};






exports.getAssignmentFile = async (req, res) => {
    const { assignmentUrl } = req.query; // Frontend will send the full S3 URL
    console.log("Fetching assignment file from URL:", assignmentUrl);

    if (!assignmentUrl) {
        return res.status(400).json({ success: false, message: "Assignment URL is required." });
    }
    // Extract the S3 key (path within the bucket) from the full S3 URL
    // Example URL: https://<bucket-name>.s3.<region>.amazonaws.com/webdev/my-assignment.pdf
    const urlParts = assignmentUrl.split('.com/');
    if (urlParts.length < 2) {
        return res.status(400).json({ success: false, message: "Invalid assignment URL format." });
    }
    const key = urlParts[1]; // This extracts 'webdev/my-assignment.pdf'

    const bucketName = process.env.AWS_BUCKET_NAME;

    try {
        const { Body, ContentType, ContentLength } = await s3.send(
            new GetObjectCommand({ Bucket: bucketName, Key: key })
        );

        // Set headers for streaming the file
        res.setHeader("Content-Type", ContentType || "application/octet-stream");
        res.setHeader("Content-Length", ContentLength);

        // Determine content disposition (inline to open in browser, attachment to force download)
        const filenameFromKey = key.split('/').pop(); // Extract original filename from S3 key
        res.setHeader("Content-Disposition", `inline; filename="${filenameFromKey}"`); // Forces browser to open if possible, otherwise downloads

        // Pipe the S3 object stream directly to the response
        Body.pipe(res);

        Body.on("error", (err) => {
            console.error("Error streaming assignment file:", err);
            if (!res.headersSent) {
                res.status(500).end();
            }
        });

    } catch (error) {
        console.error("Error fetching assignment file:", error);
        if (!res.headersSent) {
            if (error.name === 'NoSuchKey') {
                return res.status(404).json({ success: false, message: "Assignment file not found." });
            }
            if (error.name === 'AccessDenied') {
                return res.status(403).json({ success: false, message: "Access denied to fetch assignment file. Check S3 permissions." });
            }
            return res.status(500).json({ success: false, message: "Internal Server Error during file retrieval." });
        }
    }
};




exports.generateAssignmentDownloadUrl = async (req, res) => {
    const { assignmentUrl } = req.query; // The full S3 URL of the assignment file

    if (!assignmentUrl) {
        return res.status(400).json({ success: false, message: "Assignment URL is required." });
    }

    try {
        const urlParts = assignmentUrl.split('.com/');
        if (urlParts.length < 2) {
            return res.status(400).json({ success: false, message: "Invalid assignment URL format." });
        }
        const key = urlParts[1]; // Extracts 'webdev/my-assignment.pdf'

        const bucketName = process.env.AWS_BUCKET_NAME;

        // Ensure the S3 client is correctly initialized (it should be from s3Service)
        // const s3Client = new S3Client({
        //     region: process.env.AWS_REGION,
        //     credentials: {
        //         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        //         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        //     },
        // });

        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: key,
        });

        // Generate a presigned URL that expires in 15 minutes (or whatever duration)
        const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
        const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 15 }); // 15 minutes

        res.status(200).json({
            success: true,
            message: "Presigned URL generated successfully.",
            downloadUrl: presignedUrl,
        });

    } catch (error) {
        console.error("Error generating presigned URL for assignment:", error);
        res.status(500).json({ success: false, message: "Internal Server Error during URL generation." });
    }
};





exports.downloadSubmissionFile = async (req, res) => {
    const { submissionUrl } = req.query;

    if (!submissionUrl) {
        return res.status(400).json({ success: false, message: "Submission URL is required." });
    }

    try {
        let key = new URL(submissionUrl).pathname.substring(1);

        // Auto-fix if "webdev/" prefix is missing
        if (!key.startsWith("webdev/")) {
            key = `webdev/${key}`;
        }

        const bucketName = process.env.AWS_BUCKET_NAME;
        const { Body, ContentType, ContentLength } = await s3.send(
            new GetObjectCommand({ Bucket: bucketName, Key: key })
        );

        res.setHeader("Content-Type", ContentType || "application/octet-stream");
        res.setHeader("Content-Length", ContentLength);
        const filenameFromKey = key.split('/').pop();
        res.setHeader("Content-Disposition", `attachment; filename="${filenameFromKey}"`);

        Body.pipe(res);
        Body.on("error", (err) => {
            console.error("Error streaming submitted file:", err);
            if (!res.headersSent) res.status(500).end();
        });

    } catch (error) {
        console.error("Error fetching submission file:", error);
        if (!res.headersSent) {
            if (error.name === 'NoSuchKey') {
                return res.status(404).json({ success: false, message: "Submission file not found in S3." });
            }
            if (error.name === 'AccessDenied') {
                return res.status(403).json({ success: false, message: "Access denied to fetch submission file. Check S3 permissions." });
            }
            return res.status(500).json({ success: false, message: "Internal Server Error during file retrieval." });
        }
    }
};






exports.gradeSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { grade, feedback } = req.body;
        const adminId = req.admin.adminId; // From AdminAuth middleware

        if (!mongoose.Types.ObjectId.isValid(submissionId) || !mongoose.Types.ObjectId.isValid(adminId)) {
            return res.status(400).json({ success: false, message: "Invalid submission or admin ID." });
        }

        // Validate grade
        if (typeof grade !== 'number' || grade < 0 || grade > 100) {
            return res.status(400).json({ success: false, message: "Grade must be a number between 0 and 100." });
        }

        const submission = await AssignmentSubmission.findById(submissionId);

        if (!submission) {
            return res.status(404).json({ success: false, message: "Submission not found." });
        }

        submission.grade = grade;
        submission.feedback = feedback;
        submission.gradedBy = adminId;
        submission.gradedAt = new Date();

        await submission.save();

        res.status(200).json({ success: true, message: "Submission graded successfully!", submission });

    } catch (error) {
        console.error("Error grading submission:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

exports.getStudentAssignmentResults = async (req, res) => {
    try {
        const studentId = req.user.userId; // From UserAuth middleware

        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ success: false, message: "Invalid student ID." });
        }

        const submissions = await AssignmentSubmission.find({ student: studentId })
            .populate({
                path: 'assignment',
                select: 'title description video course dueDate',
                populate: [
                    { path: 'video', select: 'title' },
                    { path: 'course', select: 'title' }
                ]
            })
            .populate('gradedBy', 'email') // Populate admin email
            .sort({ submittedAt: -1 });

        // Separate submissions into graded and pending for easier display on frontend
        const gradedSubmissions = submissions.filter(s => s.grade !== undefined && s.grade !== null);
        const pendingSubmissions = submissions.filter(s => s.grade === undefined || s.grade === null);


        res.status(200).json({ success: true, gradedSubmissions, pendingSubmissions });

    } catch (error) {
        console.error("Error fetching student assignment results:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};




exports.generateAssignmentTasks = async (req, res) => {
    // Ensure the model is initialized before trying to use it
    if (!textGenModel) {
        console.warn("Gemini model not yet initialized. Attempting to initialize now.");
        await initializeGeminiModel(); // Try to initialize if it wasn't ready
        if (!textGenModel) {
            return res.status(500).json({ success: false, message: "Gemini AI model not ready. Please check backend logs." });
        }
    }

    try {
        const { topic } = req.body;
        if (!topic) {
            return res.status(400).json({ success: false, message: "Topic is required to generate tasks." });
        }

        const prompt = `Generate 8-10 short, concise homework tasks/assignments based on the following topic: "${topic}".
        Each task should be a single sentence or a very short paragraph.
        Present them as a numbered list.
        Example:
        1. Create an HTML file with a basic structure.
        2. Use <h1> and <p> tags to display a simple heading and paragraph.`;

        // Use the initialized model
        const result = await textGenModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse the numbered list
        const tasks = text.split('\n')
            .filter(line => line.match(/^\d+\.\s/))
            .map(line => line.replace(/^\d+\.\s/, '').trim());

        if (tasks.length === 0) {
            return res.status(200).json({ success: false, message: "Could not generate tasks for the given topic. Please try a different topic or be more specific.", tasks: [] });
        }

        res.status(200).json({ success: true, message: "Tasks generated successfully.", tasks });

    } catch (error) {
        console.error("Error generating assignment tasks with Gemini:", error);
        // Provide more detailed error to client for debugging AI issues
        if (error.status && error.statusText) {
            return res.status(error.status).json({ success: false, message: `AI Service Error: ${error.statusText}. Please check the topic or try again.`, errorDetails: error.errorDetails });
        }
        res.status(500).json({ success: false, message: "Failed to generate tasks. Please try again later. (AI Service Error)", error: error.message });
    }
};

exports.generateAssignmentPdf = async (req, res) => {
    try {
        const { assignmentTitle, selectedTasks } = req.body;

        if (!assignmentTitle || !Array.isArray(selectedTasks) || selectedTasks.length === 0) {
            return res.status(400).json({ success: false, message: "Assignment title and at least one selected task are required." });
        }

        const doc = new PDFDocument();
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(buffers);
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${assignmentTitle.replace(/[^a-zA-Z0-9\s]/g, '')}_Assignment.pdf"`, // Sanitize filename
                'Content-Length': pdfBuffer.length,
            });
            res.end(pdfBuffer);
        });

        // PDF Content
        doc.fontSize(24).text(assignmentTitle, { align: 'center' });
        doc.moveDown(1.5);
        doc.fontSize(14).text('Please complete the following tasks:', { align: 'left' });
        doc.moveDown(1);

        selectedTasks.forEach((task, index) => {
            doc.fontSize(12).text(`${index + 1}. ${task}`);
            doc.moveDown(0.5);
        });

        doc.moveDown(2);
        doc.fontSize(10).fillColor('gray').text('Generated by Your Learning Platform ', { align: 'center' });

        doc.end();

    } catch (error) {
        console.error("Error generating assignment PDF:", error);
        res.status(500).json({ success: false, message: "Failed to generate PDF. Please try again later." });
    }
};

