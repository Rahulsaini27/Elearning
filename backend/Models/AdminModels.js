const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    activeSession: {
        admintoken: String,
        expiresAt: Date,
    },
});

module.exports = mongoose.model("Admin", AdminSchema);
