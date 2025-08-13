// Routes/assignmentRoutes.js
const express = require("express");
const {
    generateSubmissionUploadUrl,
    saveSubmission,
    getAssignmentSubmissions, // Existing
    getSubmittedFile, // Existing
    getAdminAssignmentOverview, // <-- NEW
    getAssignmentFile,
    generateAssignmentDownloadUrl,
    downloadSubmissionFile,
    getStudentAssignmentResults,
    gradeSubmission,
    generateAssignmentTasks,
    generateAssignmentPdf
} = require("../Controller/AssignmentController");
const UserMiddleware = require("../Middlewares/UserAuth");
const adminMiddleware = require("../Middlewares/AdminAuth");

const router = express.Router();

// Student-facing routes for assignments (existing)
router.post("/submit/generate-url", UserMiddleware, generateSubmissionUploadUrl);
router.post("/submit/save", UserMiddleware, saveSubmission);

// Admin-facing routes for reviewing assignments (existing)
router.get("/:assignmentId/submissions", adminMiddleware, getAssignmentSubmissions); // Get all submissions for an assignment
router.get("/submission-file", adminMiddleware, getSubmittedFile); // Download a specific submitted file by filename

// --- NEW ADMIN ROUTES FOR ASSIGNMENT OVERVIEW ---
router.get("/admin/overview", adminMiddleware, getAdminAssignmentOverview); // Get comprehensive assignment submission status
router.get("/assignment-file-download", UserMiddleware, getAssignmentFile); // ✅ Added this line

router.get("/submission-file-url", adminMiddleware, downloadSubmissionFile);

router.get(
    "/generate-assignment-download-url",
    (req, res, next) => {
        adminMiddleware(req, res, (err) => {
            if (!err && req.admin) return next();

            UserMiddleware(req, res, (err2) => {
                if (!err2 && req.user) return next();

                return res.status(401).json({ msg: "Unauthorized" });
            });
        });
    },
    generateAssignmentDownloadUrl
);



router.put("/grade-submission/:submissionId", adminMiddleware, gradeSubmission); // <-- NEW

// NEW: Student route to get their assignment results
router.get("/my-results", UserMiddleware, getStudentAssignmentResults); // <-- NEW


router.post("/admin/generate-ai-tasks", adminMiddleware, generateAssignmentTasks);
router.post("/admin/generate-ai-pdf", adminMiddleware, generateAssignmentPdf);
// --- END NEW ADMIN ROUTES ---
module.exports = router;