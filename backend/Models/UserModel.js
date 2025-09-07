
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    otp: { type: String },
    address: { type: String },
    education: { type: String },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    occupation: { type: String },
    gender: {
        type: String,
        enum: ["male", "female", "other"], 
        required: true,
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date }, // Track last login date
    streak: { type: Number, default: 0 }, // Track login streak
    //testing for session management
    activeSession: {
        token: String,
        expiresAt: Date,
    },

}
    , {
        timestamps: true
    }
);

module.exports = mongoose.model("User", UserSchema);
