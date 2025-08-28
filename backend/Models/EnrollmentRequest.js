const mongoose = require("mongoose");

const EnrollmentRequestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    gender: { type: String, required: true },
    address: { type: String },
    education: { type: String },
    occupation: { type: String },
    
    // --- NEW FIELDS for OTP Verification ---
    otp: { type: String },
    otpExpire: { type: Date },
    isEmailVerified: { type: Boolean, default: false },
    // --- END NEW FIELDS ---
    
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Success", "Failed"],
        default: "Pending"
    },
    approvalStatus: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending"
    },
    
    paymentId: { type: String },
    paymentFailureReason: { type: String },

}, { timestamps: true });

module.exports = mongoose.model("EnrollmentRequest", EnrollmentRequestSchema);