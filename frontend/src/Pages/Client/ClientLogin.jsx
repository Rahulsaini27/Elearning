import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import axios from "axios";
import { AlertContext } from "../../Context/AlertContext";
import ProjectContext from "../../Context/ProjectContext";

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
        `${API_BASE_URL}${API_URL}${USER_BASE_URL}/login`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      // --- Backend now sends error for inactive user, so we just handle success ---
      const { token, userId } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);

      setToken(token);
      setUserId(userId);

      Toast.fire({ icon: "success", title: "Login Successful" });

      onClose();
      setTimeout(() => navigate("/client"), 500);

    } catch (error) {
      // The backend now sends a specific 403 error for inactive users, which is caught here.
      const errorMsg = error.response?.data?.msg || "Invalid credentials";
      Toast.fire({ icon: "error", title: "Login Failed", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  // ... JSX remains the same ...
  return (
    <div ref={formRef} className="relative">
      <div className="text-center">
        <h3 className=" text-2xl font-semibold text-gray-900">Welcome Back</h3>
        <p className="text-gray-600 text-sm">Login to your account</p>
      </div>
     <form onSubmit={handleLogin} className="mt-6">
  <input
    type="email"
    name="email"
    placeholder="Email Address"
    value={formData.email}
    onChange={handleChange}
    className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    required
  />
  <p className="text-blue-500 text-sm mt-2">
    Test Email: <span className="font-medium">arthp2210@gmail.com</span>
  </p>

  <input
    type="password"
    name="password"
    placeholder="Password"
    value={formData.password}
    onChange={handleChange}
    className="w-full px-4 py-2 mt-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    required
  />
  <p className="text-blue-500 text-sm mt-2">
    Test Password: <span className="font-medium">arthp2210@gmail.com</span>
  </p>

  <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
    <button
      type="button"
      onClick={() => onSwitchForm("forgot")}
      className="text-sm text-blue-500 hover:underline order-2 sm:order-1"
    >
      Forgot Password?
    </button>
    <button
      type="submit"
      className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-all duration-300 w-full sm:w-auto order-1 sm:order-2"
      disabled={loading}
    >
      {loading ? "Signing In..." : "Sign In"}
    </button>
  </div>

  <div className="mt-4 text-center">
    <button
      type="button"
      onClick={() => onSwitchForm("adminLogin")}
      className="text-sm text-gray-500 cursor-pointer hover:text-blue-500 transition-colors underline"
    >
      Login as Admin
    </button>
  </div>
</form>

      <div className="mt-6 text-center text-gray-600">
        Don't have an account?{" "}
        <button type="button" onClick={() => onSwitchForm("signup")} className="text-blue-500 cursor-pointer hover:underline">
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default ClientLogin;