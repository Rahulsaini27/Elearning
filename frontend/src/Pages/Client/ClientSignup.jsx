// ClientSignup.jsx
import React, { useContext, useState, useEffect, useRef } from "react";
// Removed Link import as it's replaced by button
import { useNavigate } from "react-router-dom"; // Keep useNavigate if needed for other navigations
import gsap from "gsap";
import axios from "axios";
import { AlertContext } from "../../Context/AlertContext";
import ProjectContext from "../../Context/ProjectContext";

// Receive onClose and onSwitchForm props from the parent (ClientUI)
const ClientSignup = ({ onClose, onSwitchForm }) => {
  const { Toast } = useContext(AlertContext);
  const { API_BASE_URL, API_URL, USER_BASE_URL } = useContext(ProjectContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Still needed for context
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

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      Toast.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "Passwords do not match.",
      });
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
        Toast.fire({
            icon: "error",
            title: "Password Too Short",
            text: "Password must be at least 6 characters.",
        });
        setLoading(false);
        return;
    }

    try {
      const response = await axios.post(
        API_BASE_URL + API_URL + USER_BASE_URL + "/register", // Assuming '/register' endpoint for user signup
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        Toast.fire({ icon: "success", title: "Registration Successful!" });
        // After successful registration, close modal and switch to login modal
        onClose();
        onSwitchForm("login"); // Automatically switch to login form
      } else {
        Toast.fire({
          icon: "error",
          title: "Registration Failed",
          text: response.data.message || "An error occurred during registration.",
        });
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "An unexpected error occurred.";
      Toast.fire({ icon: "error", title: "Registration Failed", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    // Removed min-h-screen and centering styles, and modal background/border styles as they are now handled by Modal.jsx
    <div ref={formRef} className="relative"> {/* formRef now applies to this inner div for GSAP animation */}
        <div className="text-center">
         
          <h3 className="text-2xl font-semibold text-white">Join LearnHub</h3>
          <p className="text-gray-300 text-sm">Create your student account</p>
        </div>
        <form onSubmit={handleSignup} className="mt-6">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 border border-gray-700" // Changed focus:ring-indigo-400 to blue-500
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-3 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 border border-gray-700" // Changed focus:ring-indigo-400 to blue-500
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-3 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 border border-gray-700" // Changed focus:ring-indigo-400 to blue-500
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-3 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 border border-gray-700" // Changed focus:ring-indigo-400 to blue-500
            required
          />
          <button
            type="submit"
            className="w-full mt-6 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-all duration-300" // Changed bg-indigo-600 to blue-600
            disabled={loading}
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>
        <div className="mt-6 text-center text-gray-400">
          Already have an account?{" "}
          {/* Changed Link to button with onClick to switch modal */}
          <button type="button" onClick={() => onSwitchForm("login")} className="text-blue-300 hover:underline"> {/* Changed text-indigo-300 to blue-300 */}
            Sign In
          </button>
        </div>
    </div>
  );
};

export default ClientSignup;