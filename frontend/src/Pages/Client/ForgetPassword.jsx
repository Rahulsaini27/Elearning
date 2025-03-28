import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { AlertContext } from "../../Context/AlertContext";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import GalaxyBackground from "../../Components/UI/galaxybackground";
import ProjectContext from "../../Context/ProjectContext";

function ForgetPassword() {
  const [formData, setFormData] = useState({ email: "", otp: "", newPassword: "" });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { Toast } = useContext(AlertContext);

  const { API_BASE_URL, API_URL, PASSWORD_BASE_URL } = useContext(ProjectContext)

  const navigate = useNavigate();
  const formRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );
  }, []);
  // Validate email format
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Reset error when user types
  };

  // 1️⃣ Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!isValidEmail(formData.email)) {
      Toast.fire({ icon: "error", title: "Please enter a valid email" });
      // setError("Please enter a valid email");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}${API_URL}${PASSWORD_BASE_URL}/forgot-password`, {
        email: formData.email,
      });

      if (response.data.success) {
        Toast.fire({ icon: "success", title: "OTP Sent Successfully" });
        setStep(2);
      } else {
        setError(response.data.message || "User not found");
        Toast.fire({ icon: "error", title: "User not found" });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      Toast.fire({ icon: "error", title: "Something went wrong" });

    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!formData.otp) {
      setError("Please enter the OTP");
      Toast.fire({ icon: "error", title: "Please enter the OTP" });

      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}${API_URL}${PASSWORD_BASE_URL}/verify-otp`, {
        email: formData.email,
        otp: formData.otp,
      });

      if (response.data.success) {
        Toast.fire({ icon: "success", title: "OTP Verified!" });
        setStep(3);
      } else {
        setError("Invalid OTP. Try again.");
      }
    } catch (err) {
      setError("Error verifying OTP.");
      Toast.fire({ icon: "error", title: "Error verifying OTP" });

    } finally {
      setLoading(false);
    }
  };

  // 3️⃣ Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!formData.newPassword || formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}${API_URL}${PASSWORD_BASE_URL}/reset-password`, {
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      });

      if (response.data.success) {
        Toast.fire({ icon: "success", title: "Password Reset Successfully!" });
        navigate("/login");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Error resetting password.");
      Toast.fire({ icon: "error", title: "Error resetting password" });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <GalaxyBackground />
      <div ref={formRef} className="relative bg-opacity-10 bg-white/10 backdrop-blur-lg shadow-lg rounded-xl p-8 max-w-sm w-full border border-white/20">
        <div className="text-center">
          <img className="h-16 mx-auto" src="https://i.ibb.co/hRzkkDJV/Logo-white.png" alt="Logo" />
          <h3 className="mt-4 text-2xl font-semibold text-white">
            {step === 1 ? "Forgot Password" : step === 2 ? "Verify OTP" : "Reset Password"}
          </h3>
          <p className="text-gray-300 text-sm">
            {step === 1 ? "Enter your email to receive OTP" : step === 2 ? "Enter OTP sent to your email" : "Enter new password"}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleSendOTP} className="mt-6">
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-purple-400" required />
            <button type="submit" disabled={!isValidEmail(formData.email) || loading} className="mt-4 w-full px-6 py-2 text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-400 transition-all">{loading ? "Sending..." : "Send OTP"}</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="mt-6">
            <input type="text" name="otp" value={formData.otp} onChange={handleChange} placeholder="Enter OTP" className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-purple-400" required />
            <button type="submit" disabled={!formData.otp || loading} className="mt-4 w-full px-6 py-2 text-white bg-green-500 rounded-lg shadow-md hover:bg-green-400 transition-all">{loading ? "Verifying..." : "Verify OTP"}</button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="mt-6">
            <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="New Password" className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-purple-400" required />
            <button type="submit" disabled={formData.newPassword.length < 6 || loading} className="mt-4 w-full px-6 py-2 text-white bg-purple-500 rounded-lg shadow-md hover:bg-purple-400 transition-all">{loading ? "Resetting..." : "Reset Password"}</button>
          </form>
        )}

        {error && <p className="mt-2 text-red-600 text-center">{error}</p>}

        <div className="mt-4 text-center">
          <a href="/login" className="text-purple-300 hover:underline">Back to Login</a>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
