const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel");
require("dotenv").config();

const UserMiddleware = async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || !user.activeSession || user.activeSession.token !== token) {
            return res.status(401).json({ msg: "Session expired, please log in again" });
        }

        if (user.activeSession.expiresAt < new Date()) {
            user.activeSession = null;
            await user.save();
            return res.status(401).json({ msg: "Session expired, please log in again" });
        }

        req.user = { userId: user._id };
        next();
    } catch (error) {
        res.status(401).json({ msg: "Token is not valid" });
    }
};

module.exports = UserMiddleware;
