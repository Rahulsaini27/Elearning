const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel");
const Course = require("../Models/Course");
require("dotenv").config();

// Register User
const mongoose = require("mongoose");
// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "User does not exist" });

        if (!user.isActive) return res.status(403).json({ msg: "Your account is inactive. Please contact admin." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Your password is wrong" });

        // Generate new JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3h" });

        // Set expiration time (3 hours from now)
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 3);
        // Invalidate previous session (auto logout previous device)
        user.activeSession = { token, expiresAt };

        // Update login streak
        const currentTime = new Date();
        if (user.lastLogin) {
            const lastLoginDate = new Date(user.lastLogin);
            const diffInDays = Math.floor((currentTime - lastLoginDate) / (1000 * 60 * 60 * 24));

            if (diffInDays === 1) {
                user.streak += 1;
            } else if (diffInDays > 1) {
                user.streak = 1;
            }
        } else {
            user.streak = 1;
        }

        user.lastLogin = currentTime;
        await user.save();

        res.json({ token, userId: user._id });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};
// Logout User
exports.logoutUser = async (req, res) => {
    const { userId } = req.user;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: "User not found" });

        // Clear active session
        user.activeSession = null;
        await user.save();

        res.json({ msg: "Logout successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};



// Verify User Token
exports.verifyToken = (req, res) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ valid: true, userId: decoded.userId });
    } catch (error) {
        res.status(401).json({ msg: "Token is not valid or expired" });
    }
};
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, address, education, occupation, gender, enrolledCourses } = req.body;


        let existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }
        if (!enrolledCourses) {
            return res.status(400).json({ msg: "No enrolled courses received" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Ensure enrolledCourses is an array of ObjectIds
        let validCourses = [];
        if (Array.isArray(enrolledCourses)) {
            validCourses = enrolledCourses
                .filter(courseId => mongoose.Types.ObjectId.isValid(courseId)) // Ensure valid ObjectId
                .map(courseId => new mongoose.Types.ObjectId(courseId));
        }
        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            education,
            occupation,
            gender,
            enrolledCourses: enrolledCourses // Ensure correct format
        });
        console.log(enrolledCourses)
        // Save user to database
        await Course.updateMany(
            { _id: { $in: enrolledCourses }, assignedStudents: { $ne: newUser._id } }, // Prevent duplicates
            { $push: { assignedStudents: newUser._id } }
        );

        await newUser.save();
        // Assign courses to user

        res.status(201).json({ msg: "User registered successfully" });

    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};




// Get User Profile
exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id; // Get user ID from URL

        const user = await User.findById(userId)
            .select("-password")
            .populate("enrolledCourses", "title category description lessons videos"); // ✅ Fetch course title & category

        if (!user) return res.status(404).json({ msg: "User not found" });

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};


// Get All Users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate({
            path: "enrolledCourses", // Assuming "enrolledCourses" stores course IDs
            select: "title" // Only fetch the course title (avoid unnecessary data)
        });

        res.status(200).json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};


// Update User

exports.updateUser = async (req, res) => {
    try {
        const { password, ...updateFields } = req.body;

        // ✅ If updating password, hash it
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateFields.password = hashedPassword;
        }

        // ✅ Fetch the existing user to check current courses
        const existingUser = await User.findById(req.params.id);
        if (!existingUser) {
            return res.status(404).json({ msg: "User not found" });
        }


        // ✅ Update the user
        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateFields, { new: true });

        res.status(200).json({ msg: "User updated successfully", user: updatedUser });
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};



// Delete User
exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({ msg: "User not found" });
        }
        await Course.updateMany(
            { assignedStudents: User._id },
            { $pull: { assignedStudents: User._id } }
        );


        res.status(200).json({ msg: "User deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

exports.toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        user.isActive = !user.isActive; // Toggle status
        await user.save();

        res.status(200).json({ msg: `User is now ${user.isActive ? "Active" : "Inactive"}`, isActive: user.isActive });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};




exports.assignCourseToUser = async (req, res) => {
    try {
        const { userId, courseId } = req.body;

        // ✅ Validate MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ success: false, msg: "Invalid user or course ID" });
        }

        // ✅ Find user and course
        const [user, course] = await Promise.all([
            User.findById(userId),
            Course.findById(courseId)
        ]);

        if (!user) return res.status(404).json({ success: false, msg: "User not found" });
        if (!course) return res.status(404).json({ success: false, msg: "Course not found" });

        // ✅ Prevent duplicate enrollments
        const isUserAlreadyEnrolled = user.enrolledCourses.some(id => id.toString() === courseId);
        const isCourseAlreadyAssigned = course.assignedStudents.some(id => id.toString() === userId);

        if (isUserAlreadyEnrolled && isCourseAlreadyAssigned) {
            return res.status(400).json({ success: false, msg: "User is already enrolled in this course" });
        }

        // ✅ Assign course to user if not already enrolled
        if (!isUserAlreadyEnrolled) {
            user.enrolledCourses.push(courseId);
        }

        // ✅ Assign user to course if not already assigned
        if (!isCourseAlreadyAssigned) {
            course.assignedStudents.push(userId);
            course.markModified("assignedStudents");  // 🔥 Ensure Mongoose detects change
        }

        // ✅ Save both models simultaneously for efficiency
        await Promise.all([user.save(), course.save()]);

        res.status(200).json({ success: true, msg: "Course assigned successfully", user, course });

    } catch (err) {
        console.error("Error assigning course to user:", err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

exports.removeStudentFromCourse = async (req, res) => {
    try {
        const { courseId, userId } = req.params; // Extract both params

        // Find the course
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        // Find the user
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if student is in the course
        if (!course.assignedStudents.includes(userId)) {
            return res.status(400).json({ message: "Student is not assigned to this course" });
        }

        // Remove student from the course's assignedStudents array
        course.assignedStudents = course.assignedStudents.filter(id => id.toString() !== userId);
        await course.save(); // Save updated course

        // Remove course from the user's enrolledCourses array
        user.enrolledCourses = user.enrolledCourses.filter(id => id.toString() !== courseId);
        await user.save(); // Save updated user

        res.status(200).json({ message: "Student removed successfully from course and user model", course, user });
    } catch (error) {
        console.error("Error in removeStudentFromCourse:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

