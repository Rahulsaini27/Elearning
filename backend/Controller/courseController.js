const { default: mongoose } = require("mongoose");
const Course = require("../Models/Course");
const User = require("../Models/UserModel");


const createCourse = async (req, res) => {
    try {
        const newCourse = new Course(req.body);
        await newCourse.save();
        res.status(201).json({ message: "Course created successfully", course: newCourse });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error", error });
    }
};

const getCourseNameAndPrice = async (req, res) => {
    try {
        const courses = await Course.find({}, "_id title price");
""
        res.status(200).json({
            success: true,
            data: courses
        });
    } catch (error) {
        console.error("Error fetching course names & prices:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// Get All Courses
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate("videos assignedStudents");
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get Course by ID

const getCourseById = async (req, res) => {
    try {
        const { userId, courseId } = req.params;
        // console.log(userId, courseId)

        if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid course or user ID" });
        }

        //  Check if User Exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }


        // Fetch Course with Videos & Assigned Students
        const course = await Course.findById(courseId)
            .populate("videos")
            .populate("assignedStudents", "name email");

        // console.log(userId, courseId)
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // Check if User is Enrolled
        if (!user.enrolledCourses.includes(courseId)) {
            return res.status(403).json({ success: false, message: "Access denied: You are not enrolled in this course" });
        }
        res.status(200).json({
            success: true,
            message: "Course retrieved successfully",
            course,
        });
    } catch (error) {
        console.error("Error fetching course:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};




// Update Course
const updateCourse = async (req, res) => {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCourse) return res.status(404).json({ message: "Course not found" });

        res.status(200).json({ message: "Course updated successfully", course: updatedCourse });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Delete Course
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) return res.status(404).json({ message: "Course not found" });

        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


module.exports = { createCourse, getCourseById, getCourses, updateCourse, deleteCourse ,getCourseNameAndPrice };
