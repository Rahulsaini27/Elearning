const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel");
require("dotenv").config();

// Register User
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, address, education, occupation, dateOfBirth, gender } = req.body;
        // Check if user already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            education,
            occupation,
            dateOfBirth,
            gender,
        });

        // Save user to database
        await newUser.save();

        res.status(201).json({ msg: "User registered successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid credentials" });

        if (!user.isActive) return res.status(403).json({ msg: "Your account is inactive. Please contact admin." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, userId: user._id });

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

// Get User Profile
exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id; // Get user ID from URL

        const user = await User.findById(userId).select("-password");
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
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};


// Update User
exports.updateUser = async (req, res) => {
    try {

        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.status(200).json({ msg: "User updated successfully", user: updatedUser });
    } catch (err) {
        console.error(err);
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
