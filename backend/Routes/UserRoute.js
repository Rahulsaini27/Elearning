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

const adminMiddleware = require("../Middlewares/AdminAuth");
const UserMiddleware = require("../Middlewares/UserAuth");
const router = express.Router();

// User authentication routes
router.post("/login", loginUser);
router.post("/verify-token", verifyToken);

// Protected Routes
router.post("/register", adminMiddleware, registerUser);
router.get("/getUser/:id", adminMiddleware|| UserMiddleware, getUserProfile);
router.get("/getUser", adminMiddleware, getAllUsers);
router.put("/edit/:id", adminMiddleware  , updateUser);
router.delete("/delete/:id", adminMiddleware, deleteUser);
router.put("/updateStatus/:id", adminMiddleware, toggleUserStatus);

module.exports = router;
