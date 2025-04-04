const Admin = require("../Models/AdminModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Admin Login
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ msg: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const currentTime = new Date();

    // Check if already logged in
    if (admin.activeSession?.admintoken && admin.activeSession.expiresAt > currentTime) {
      return res.status(403).json({ msg: "You are already logged in on another device." });
    }

    // Generate token
    const admintoken = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    // Store active session
    admin.activeSession = {
      admintoken,
      expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000), // Expires in 3 hours
    };
    await admin.save();

    res.json({ admintoken , adminId: admin._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};


exports.logoutAdmin = async (req, res) => {
  if (!req.admin || !req.admin.adminId) {
    return res.status(401).json({ msg: "Unauthorized request" });
  }

  const { adminId } = req.admin;

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    // Clear active session
    admin.activeSession = null;
    await admin.save();

    res.json({ msg: "Logout successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Admin Registration (For Testing)
exports.registerAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const adminExists = await Admin.findOne({ email });
    if (adminExists) return res.status(400).json({ msg: "Admin already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({ email, password: hashedPassword });
    await newAdmin.save();

    res.json({ msg: "Admin registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Verify Admin Token
exports.verifyToken = (req, res) => {
  const admintoken = req.header("Authorization")?.replace("Bearer ", "");

  if (!admintoken) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(admintoken, process.env.JWT_SECRET);
    res.json({ valid: true, adminId: decoded.id });
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid or expired" });
  }
};
