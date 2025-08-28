// Controller/enrollmentController.js

const EnrollmentRequest = require("../Models/EnrollmentRequest");
const Course = require("../Models/Course");
const User = require("../Models/UserModel");
const bcrypt = require("bcryptjs");
const Razorpay = require('razorpay');
const nodemailer = require("nodemailer");
require("dotenv").config();

// --- Re-using Nodemailer setup ---
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// STEP 1 (Signup): Create a pending request and send OTP for verification.
exports.registerAndSendOtp = async (req, res) => {
    try {
        const { name, email, password, courseId, gender } = req.body;

        if (!name || !email || !password || !courseId || !gender) {
            return res.status(400).json({ msg: "All fields are required." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "An account with this email already exists." });
        }
        const existingRequest = await EnrollmentRequest.findOne({ email, approvalStatus: 'Approved' });
        if (existingRequest) {
            return res.status(400).json({ msg: "An approved enrollment for this email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOtp();

        // Use findOneAndUpdate to create or update a pending request
        const newRequest = await EnrollmentRequest.findOneAndUpdate(
            { email: email, approvalStatus: 'Pending' }, // Find existing pending request
            {
                name,
                password: hashedPassword,
                course: courseId,
                gender,
                otp,
                otpExpire: Date.now() + 10 * 60 * 1000, // 10 minutes
                isEmailVerified: false,
            },
            { upsert: true, new: true, setDefaultsOnInsert: true } // Create if not found
        );

        const mailOptions = {
            from: `"LearnHub" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify Your Email for LearnHub Signup",
            html: `<div style="font-family: Arial, sans-serif; text-align: center; color: #333;"><h2>Welcome to LearnHub!</h2><p>Your One-Time Password (OTP) for email verification is:</p><p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #4F46E5;">${otp}</p><p>This OTP is valid for 10 minutes.</p></div>`,
        };
        await transporter.sendMail(mailOptions);

        res.status(201).json({
            success: true,
            msg: "OTP sent to your email. Please verify to proceed.",
            requestId: newRequest._id,
        });

    } catch (err) {
        console.error("Error in registerAndSendOtp:", err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

// STEP 2 (Signup): Verify OTP and then initiate the payment process.
exports.verifyOtpAndInitiatePayment = async (req, res) => {
    try {
        const { requestId, otp } = req.body;
        const request = await EnrollmentRequest.findById(requestId).populate('course');

        if (!request || request.otp !== otp || request.otpExpire < Date.now()) {
            return res.status(400).json({ success: false, msg: "Invalid or expired OTP." });
        }
        
        request.isEmailVerified = true;
        request.otp = undefined;
        request.otpExpire = undefined;
        await request.save();

        if (!request.course || typeof request.course.price !== 'number' || request.course.price <= 0) {
            return res.status(400).json({ success: false, msg: "Course price is not valid." });
        }

        const options = {
            amount: request.course.price * 100,
            currency: "INR",
            receipt: request._id.toString(),
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            msg: "Email verified! Proceeding to payment.",
            order: order,
        });

    } catch (err) {
        console.error("Error in verifyOtpAndInitiatePayment:", err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

// (Admin-Side) Get all enrollment requests
exports.getAllRequests = async (req, res) => {
    try {
        const requests = await EnrollmentRequest.find()
            .populate("course", "title")
            .sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

// (Admin-Side) Approve an enrollment request
exports.approveRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const request = await EnrollmentRequest.findById(requestId).populate('course'); //Populate course details

        if (!request) {
            return res.status(404).json({ msg: "Enrollment request not found." });
        }
        if (request.approvalStatus === "Approved") {
            return res.status(400).json({ msg: "This request has already been approved." });
        }
        if (request.paymentStatus !== "Success") {
            return res.status(400).json({ msg: "Cannot approve request: Payment is not successful." });
        }

        const newUser = new User({
            name: request.name,
            email: request.email,
            password: request.password, // This is already hashed
            phone: request.phone,
            address: request.address,
            education: request.education,
            occupation: request.occupation,
            gender: request.gender,
            enrolledCourses: [request.course._id]
        });
        await newUser.save();
        
        await Course.findByIdAndUpdate(
            request.course._id,
            { $push: { assignedStudents: newUser._id } }
        );

        request.approvalStatus = "Approved";
        await request.save();

        // --- NEW: Send Approval Email ---
        const mailOptions = {
            from: `"LearnHub" <${process.env.EMAIL_USER}>`,
            to: request.email,
            subject: "Enrollment Approved! Welcome to LearnHub!",
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>Welcome to LearnHub, ${request.name}!</h2>
                    <p>Your enrollment request has been approved. You can now log in and start learning.</p>
                    <h3>Your Login Details:</h3>
                    <ul>
                        <li><strong>Email:</strong> ${request.email}</li>
                        <li><strong>Password:</strong> You can use the password you created during signup.</li>
                    </ul>
                    <h3>Course Details:</h3>
                    <p>You have been enrolled in the following course:</p>
                    <div style="border: 1px solid #ddd; padding: 15px; border-radius: 5px; background-color: #f9f9f9;">
                        <h4>${request.course.title}</h4>
                        <p><strong>Description:</strong> ${request.course.description}</p>
                        <p><strong>Lessons:</strong> ${request.course.lessons}</p>
                    </div>
                    <p>Happy Learning!</p>
                    <p>Best Regards,<br/>The LearnHub Team</p>
                </div>
            `,
        };
        await transporter.sendMail(mailOptions);
        // --- END: Send Approval Email ---


        res.status(200).json({ msg: "User approved, registered, and notified successfully!", user: newUser });
    } catch (err) {
        console.error("Error approving request:", err);
        res.status(500).json({ msg: "Internal Server Error", error: err.message });
    }
};


// (Admin-Side) Reject an enrollment request
exports.rejectRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const request = await EnrollmentRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({ msg: "Enrollment request not found." });
        }
        if (request.approvalStatus === "Approved") {
            return res.status(400).json({ msg: "Cannot reject an already approved request." });
        }

        request.approvalStatus = "Rejected";
        await request.save();

        res.status(200).json({ msg: "Enrollment request has been rejected." });
    } catch (err) {
        console.error("Error rejecting request:", err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};