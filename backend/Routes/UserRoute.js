const express = require("express");
const { registerUser,
    loginUser,
    verifyToken,
    getUserProfile,
    getAllUsers,
    updateUser,
    deleteUser,
    toggleUserStatus

} = require("../Controller/UserController");
const authMiddleware = require("../Middlewares/Auth");

const router = express.Router();

// User authentication routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-token", verifyToken);

// Protected Routes
router.get("/getUser/:id", getUserProfile);
// router.get("/profile", getUserProfile);
router.get("/getUser", getAllUsers);
router.put("/edit/:id", updateUser);
router.delete("/delete/:id", deleteUser);
router.put("/updateStatus/:id", toggleUserStatus);

module.exports = router;
