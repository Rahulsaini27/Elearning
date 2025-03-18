

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    education: { type: String },
    occupation: { type: String },
    dateOfBirth: { type: String },
    gender: {
        type: String,
        enum: ["male", "female", "other"], // ✅ Ensure it matches frontend options
        required: true,
    },
    isActive: { type: Boolean, default: true }
}
    , {
        timestamps: true
    }
);

module.exports = mongoose.model("User", UserSchema);
