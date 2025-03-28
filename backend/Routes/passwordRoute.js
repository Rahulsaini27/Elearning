const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp, resetPassword } = require("../Controller/passwordController");

router.post("/forgot-password", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

module.exports = router;
