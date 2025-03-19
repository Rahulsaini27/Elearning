const jwt = require("jsonwebtoken");
require("dotenv").config();

const adminMiddleware = (req, res, next) => {
  const admintoken = req.header("Authorization")?.replace("Bearer ", "");

  if (!admintoken) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(admintoken, process.env.JWT_SECRET);
    req.admin = decoded; // Attach admin info to request object
    next();

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Session expired, please log in again" });
    }
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = adminMiddleware;
