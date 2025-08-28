
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { AlertContext } from "../../Context/AlertContext";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import ProjectContext from "../../Context/ProjectContext";

function ForgetPassword({ onClose, onSwitchForm }) {
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

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!isValidEmail(formData.email)) {
      Toast.fire({ icon: "error", title: "Please enter a valid email" });
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

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!formData.newPassword || formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      Toast.fire({icon: "error", title: "Password must be at least 6 characters"});
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
        onClose();
        onSwitchForm("login");
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
    <div ref={formRef} className="relative">
        <div className="text-center">
          <h3 className="mt-4 text-2xl font-semibold text-gray-900"> {/* MODIFIED: text-white to text-gray-900 */}
            {step === 1 ? "Forgot Password" : step === 2 ? "Verify OTP" : "Reset Password"}
          </h3>
          <p className="text-gray-600 text-sm"> {/* MODIFIED: text-gray-300 to text-gray-600 */}
            {step === 1 ? "Enter your email to receive OTP" : step === 2 ? "Enter OTP sent to your email" : "Enter new password"}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleSendOTP} className="mt-6">
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required /> {/* MODIFIED: Styles for white BG */}
            <button type="submit" disabled={!isValidEmail(formData.email) || loading} className="mt-4 w-full px-6 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all">{loading ? "Sending..." : "Send OTP"}</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="mt-6">
            <input type="text" name="otp" value={formData.otp} onChange={handleChange} placeholder="Enter OTP" className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required /> {/* MODIFIED: Styles for white BG */}
            <button type="submit" disabled={!formData.otp || loading} className="mt-4 w-full px-6 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all">{loading ? "Verifying..." : "Verify OTP"}</button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="mt-6">
            <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="New Password" className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required /> {/* MODIFIED: Styles for white BG */}
            <button type="submit" disabled={formData.newPassword.length < 6 || loading} className="mt-4 w-full px-6 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all">{loading ? "Resetting..." : "Reset Password"}</button>
          </form>
        )}

        {error && <p className="mt-2 text-red-600 text-center">{error}</p>}

        <div className="mt-4 text-center">
          <button type="button" onClick={() => onSwitchForm("login")} className="text-blue-500 hover:underline">Back to Login</button> {/* MODIFIED: text-blue-300 to text-blue-500 */}
        </div>
    </div>
  );
}

export default ForgetPassword;