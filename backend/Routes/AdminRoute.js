const express = require("express");
const { adminLogin, registerAdmin, verifyToken, logoutAdmin } = require("../Controller/AdminController");
const adminMiddleware = require("../Middlewares/AdminAuth");

const router = express.Router();

// Admin authentication routes
router.post("/login", adminLogin);
router.post("/register", registerAdmin);
router.post("/verify-token", verifyToken);
router.post("/logout", adminMiddleware, logoutAdmin);

// Protected Route Example

module.exports = router;
