const express = require("express");
const { registerUser,
    loginUser,
    verifyToken,
    getUserProfile,
    getAllUsers,
    updateUser,
    deleteUser,
    toggleUserStatus,
    assignCourseToUser,
    removeStudentFromCourse,
    logoutUser
} = require("../Controller/UserController");

const adminMiddleware = require("../Middlewares/AdminAuth");
const UserMiddleware = require("../Middlewares/UserAuth");
const router = express.Router();

// User authentication routes
router.post("/login", loginUser);
router.post("/verify-token", verifyToken);
router.post("/logout", UserMiddleware || adminMiddleware,  logoutUser);

// Protected Routes
router.post("/register", adminMiddleware, registerUser);
router.get("/getUser/:id", adminMiddleware || UserMiddleware, getUserProfile);
router.get("/getUser", adminMiddleware, getAllUsers);

router.put("/edit/:id", adminMiddleware, updateUser);

router.delete("/delete/:id", adminMiddleware, deleteUser);
router.put("/updateStatus/:id", adminMiddleware, toggleUserStatus);
//route for assign remove a course 
router.post("/assign-course", adminMiddleware, assignCourseToUser);
router.post("/remove-student/:courseId/:userId", adminMiddleware, removeStudentFromCourse);

module.exports = router;
