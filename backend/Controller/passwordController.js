const User = require("../Models/UserModel");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Nodemailer Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

});

// Generate OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP
exports.sendOtp = async (req, res) => {

  const { email } = req.body;
  let user = await User.findOne({ email });

  if (!user) return res.json({ success: false, message: "User not found" });

  const otp = generateOtp();
  user.otp = otp;
  user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes expiration
  await user.save();

  const mailOptions = {
    from: `"Requin" <${process.env.EMAIL_USER}>`, // Display sender name
    to: email,
    subject: "🔐 Reset Your Password ",
    html: `
      <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        
        <!-- Logo -->
        <div style="text-align: center;">
          <img src="../../frontend/public/logo.png" alt="Your Logo" style="width: 120px; margin-bottom: 20px;">
        </div>
  
        <!-- Welcome Message -->
        <h2 style="color: #333; text-align: center;">🔑 Password Reset Request</h2>
        <p style="font-size: 16px; color: #555; text-align: center;">
          Hello, we received a request to reset your password. Use the OTP below to proceed:
        </p>
  
        <!-- OTP Box -->
        <div style="text-align: center; font-size: 24px; font-weight: bold; background: #f3f3f3; padding: 10px; border-radius: 5px; display: inline-block; margin: 10px auto;">
          ${otp}
        </div>
  
        <p style="font-size: 14px; color: #777; text-align: center;">
          This OTP is valid for <strong>10 minutes</strong>. If you didn't request a password reset, please ignore this email.
        </p>
  
        <!-- Security Note -->
        <div style="border-top: 1px solid #eee; padding-top: 10px; margin-top: 20px; font-size: 12px; color: #999; text-align: center;">
          ⚠️ Do not share this OTP with anyone. Our team will never ask for your password.
        </div>
  
      </div>
    `,
  };
  transporter.sendMail(mailOptions, (error) => {
    if (error) return res.json({ success: false, message: "Error sending email" });
    res.json({ success: true, message: "OTP sent to your email" });
  });
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || user.otpExpire < Date.now()) {
    return res.json({ success: false, message: "Invalid or expired OTP" });
  }

  res.json({ success: true, message: "OTP verified" });
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.json({ success: false, message: "User not found" });

  user.password = newPassword;
  user.otp = null;
  user.otpExpire = null;
  await user.save();

  res.json({ success: true, message: "Password reset successful" });
};
