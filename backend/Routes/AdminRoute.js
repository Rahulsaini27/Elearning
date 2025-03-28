const express = require("express");
const { adminLogin, registerAdmin, verifyToken } = require("../Controller/AdminController");

const router = express.Router();

// Admin authentication routes
router.post("/login", adminLogin);
router.post("/register", registerAdmin);
router.post("/verify-token", verifyToken);

// Protected Route Example

module.exports = router;
