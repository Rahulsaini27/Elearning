import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import axios from "axios";
import { AlertContext } from "../../Context/AlertContext";
import ProjectContext from "../../Context/ProjectContext";
import GalaxyBackground from "../../Components/UI/galaxybackground";

const ClientLogin = () => {
  const { Toast } = useContext(AlertContext);
  const { API_BASE_URL, API_URL, USER_BASE_URL } = useContext(ProjectContext);
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

      if (isActive) {
        Toast.fire({
          icon: "error",
          title: "Account Inactive",
          text: "Your account is inactive. Please contact support.",
        });
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      navigate("/client");
    
      Toast.fire({ icon: "success", title: "Login Successfully" });
    } catch (error) {
      const errorMsg = error.response?.data?.msg || "Invalid credentials";
      Toast.fire({ icon: "error", title: "Login Failed", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <GalaxyBackground />
      <div ref={formRef} className="relative bg-opacity-10 bg-white/10 backdrop-blur-lg shadow-lg rounded-xl p-8 max-w-sm w-full border border-white/20">
        <div className="text-center">
          <img className="h-24 mx-auto" src="https://i.ibb.co/hRzkkDJV/Logo-white.png" alt="Logo" />
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
            className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-400 border border-gray-700"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-3 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-400 border border-gray-700"
            required
          />
          <div className="flex items-center justify-between mt-4">
            <Link to="/forgot-password" className="text-sm text-purple-300 hover:underline">Forgot Password?</Link>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-md transition-all duration-300"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientLogin;
