import { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AlertContext } from "../../Context/AlertContext";
import ProjectContext from "../../Context/ProjectContext";
import gsap from "gsap";
import GalaxyBackground from "../../Components/UI/galaxybackground";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { Toast } = useContext(AlertContext);
  const { API_BASE_URL, API_URL, ADMIN_BASE_URL, setAdminToken ,setAdminId } = useContext(ProjectContext);
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
      const { data } = await axios.post(
        API_BASE_URL + API_URL + ADMIN_BASE_URL + "/login",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      setAdminId(data.admintoken);
      localStorage.setItem("admintoken", data.admintoken);
      setAdminToken(data.admintoken);
      setTimeout(() => navigate("/admin"), 2000);

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
          <img className="h-16 mx-auto" src="https://i.ibb.co/hRzkkDJV/Logo-white.png" alt="Logo" />
          <h3 className="mt-4 text-2xl font-semibold text-white">Welcome Back</h3>
          <p className="text-gray-300 text-sm">Log in to your admin account</p>
        </div>

        <form onSubmit={handleLogin} className="mt-6">
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="w-full px-4 py-2 rounded-lg  text-white border border-gray-700 focus:ring-2 focus:ring-purple-400" required />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full px-4 py-2 mt-3 rounded-lg  text-white border border-gray-700 focus:ring-2 focus:ring-purple-400" required />
          <div className="flex items-center justify-between mt-4">
            <Link to="/adminlogin" className="text-sm text-purple-300 hover:underline">Forgot Password?</Link>
            <button type="submit" className="px-6 py-2 text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-400 transition-all" disabled={loading}>{loading ? "Signing In..." : "Sign In"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
