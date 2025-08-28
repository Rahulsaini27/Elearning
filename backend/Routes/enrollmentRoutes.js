const express = require("express");
const router = express.Router();
const { 
    registerAndSendOtp,
    verifyOtpAndInitiatePayment,
    getAllRequests,
    approveRequest,
    rejectRequest 
} = require("../Controller/enrollmentController");
const adminMiddleware = require("../Middlewares/AdminAuth");

// --- PUBLIC SIGNUP FLOW ---
router.post("/register-send-otp", registerAndSendOtp);
router.post("/verify-otp-payment", verifyOtpAndInitiatePayment);

// --- ADMIN ROUTES ---
router.get("/admin/requests", adminMiddleware, getAllRequests);
router.post("/admin/approve/:requestId", adminMiddleware, approveRequest);
router.post("/admin/reject/:requestId", adminMiddleware, rejectRequest);

module.exports = router;