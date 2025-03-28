const express = require("express");
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../Controller/courseController");
const adminMiddleware = require("../Middlewares/AdminAuth");
const UserMiddleware = require("../Middlewares/UserAuth");

const router = express.Router();

router.post("/create", adminMiddleware, createCourse);
router.get("/getCourses", adminMiddleware, getCourses);

router.get("/:userId/:courseId",adminMiddleware || UserMiddleware ,getCourseById);

router.put("/update/:id", adminMiddleware, updateCourse);
router.delete("/delete/:id", adminMiddleware, deleteCourse);

module.exports = router;
