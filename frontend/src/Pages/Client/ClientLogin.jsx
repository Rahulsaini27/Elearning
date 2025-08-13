// ClientLogin.jsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom"; // Keep useNavigate for post-login redirect
import gsap from "gsap";
import { useEffect, useRef } from "react";
import axios from "axios";
import { AlertContext } from "../../Context/AlertContext";
import ProjectContext from "../../Context/ProjectContext";

// Receive onClose and onSwitchForm props from the parent (ClientUI)
const ClientLogin = ({ onClose, onSwitchForm }) => {
  const { Toast } = useContext(AlertContext);
  const { API_BASE_URL, API_URL, USER_BASE_URL, setToken, setUserId } = useContext(ProjectContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const response = await axios.post(
            API_BASE_URL + API_URL + USER_BASE_URL + "/login",
            formData,
            { headers: { "Content-Type": "application/json" } }
        );

        const { token, userId, isActive } = response.data;

        // Corrected logic: Prevent login if the account is NOT active (i.e., isActive is false)
        if (!isActive) {
            Toast.fire({
                icon: "error",
                title: "Account Inactive",
                text: "Your account is inactive. Please contact support.",
            });
            setLoading(false);
            return;
        }

        // Store token and user ID in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);

        // Update context state
        setToken(token);
        setUserId(userId);

        Toast.fire({ icon: "success", title: "Login Successfully" });

        // Close the modal and then redirect to client dashboard
        onClose();
        setTimeout(() => navigate("/client"), 500); // Short delay for smooth modal close animation

    } catch (error) {
        const errorMsg = error.response?.data?.msg || "Invalid credentials";
        Toast.fire({ icon: "error", title: "Login Failed", text: errorMsg });
    } finally {
        setLoading(false);
    }
};


  return (
    // Removed min-h-screen and centering styles, and modal background/border styles as they are now handled by Modal.jsx
    <div ref={formRef} className="relative"> {/* formRef now applies to this inner div for GSAP animation */}
        <div className="text-center">
          <h3 className=" text-2xl font-semibold text-white">Welcome Back</h3>
          <p className="text-gray-300 text-sm">Login to your account</p>
        </div>
        <form onSubmit={handleLogin} className="mt-6">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 border border-gray-700" // Changed focus:ring-indigo-400 to blue-500
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-3 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 border border-gray-700" // Changed focus:ring-indigo-400 to blue-500
            required
          />
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
            {/* Changed Link to button with onClick to switch modal */}
            <button type="button" onClick={() => onSwitchForm("forgot")} className="text-sm text-blue-300 hover:underline order-2 sm:order-1">Forgot Password?</button> {/* Changed text-indigo-300 to blue-300 */}
            <button
              type="submit"
              className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-all duration-300 w-full sm:w-auto order-1 sm:order-2" // Changed bg-indigo-600 to blue-600
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </div>
          <div className="mt-4 text-center">
            {/* Changed Link to button with onClick to switch modal */}
            <button
              type="button"
              onClick={() => onSwitchForm("adminLogin")}
              className="text-sm text-gray-400 hover:text-blue-300 transition-colors underline" // Changed hover:text-indigo-300 to blue-300
            >
              Login as Admin
            </button>
          </div>
        </form>
        <div className="mt-6 text-center text-gray-400">
          Don't have an account?{" "}
          {/* Changed Link to button with onClick to switch modal */}
          <button type="button" onClick={() => onSwitchForm("signup")} className="text-blue-300 hover:underline"> {/* Changed text-indigo-300 to blue-300 */}
            Sign Up
          </button>
        </div>
    </div>
  );
};

export default ClientLogin;