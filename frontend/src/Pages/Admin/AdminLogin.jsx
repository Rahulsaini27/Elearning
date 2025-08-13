// AdminLogin.jsx
import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Keep useNavigate for post-login redirect
import axios from "axios";
import { AlertContext } from "../../Context/AlertContext";
import ProjectContext from "../../Context/ProjectContext";
import gsap from "gsap";

// Receive onClose and onSwitchForm props from the parent (ClientUI)
const AdminLogin = ({ onClose, onSwitchForm }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { Toast } = useContext(AlertContext);
  const { API_BASE_URL, API_URL, ADMIN_BASE_URL, setAdminToken, setAdminId } = useContext(ProjectContext);
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
      setAdminId(data.admintoken); // This is from your original code, seemingly storing token as adminId.
      localStorage.setItem("admintoken", data.admintoken);
      setAdminToken(data.admintoken);

      Toast.fire({ icon: "success", title: "Login Successfully" });

      // Close the modal and then navigate to the admin dashboard
      onClose();
      setTimeout(() => navigate("/admin"), 500); // Short delay for smooth modal close animation

    } catch (error) {
      const errorMsg = error.response?.data?.msg || "Invalid credentials";
      Toast.fire({ icon: "error", title: "Login Failed", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    // Removed min-h-screen and centering styles.
    // Also removed the specific AdminLogin modal background/border styles as they are now handled by Modal.jsx
    <div ref={formRef} className="relative"> {/* formRef now applies to this inner div for GSAP animation */}
      {/* Design change: Adjusted heading and button color to match clientUI */}
        <div className="text-center">
          <h3 className="mt-4 text-2xl font-semibold text-white">Admin Access</h3> {/* Changed text */}
          <p className="text-gray-300 text-sm">Log in to your administrator account</p> {/* Changed text */}
        </div>

        <form onSubmit={handleLogin} className="mt-6">
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white placeholder-gray-500 border border-gray-700 focus:ring-2 focus:ring-blue-500" required /> {/* Changed focus:ring-indigo-400 to blue-500 */}
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full px-4 py-2 mt-3 rounded-lg bg-gray-900 text-white placeholder-gray-500 border border-gray-700 focus:ring-2 focus:ring-blue-500" required /> {/* Changed focus:ring-indigo-400 to blue-500 */}
          <div className="flex items-center justify-between mt-4">
            {/* Changed Link to button with onClick to switch modal */}
            <button type="button" onClick={() => onSwitchForm("forgot")} className="text-sm text-blue-300 hover:underline">Forgot Password?</button> {/* Changed text-indigo-300 to blue-300 */}
            <button type="submit" className="px-6 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all" disabled={loading}>{loading ? "Signing In..." : "Sign In"}</button> {/* Changed bg-purple-600 to blue-600 */}
          </div>
        </form>
        <div className="mt-6 text-center text-gray-400">
          Are you a student?{" "}
          {/* Changed Link to button with onClick to switch modal */}
          <button type="button" onClick={() => onSwitchForm("login")} className="text-blue-300 hover:underline"> {/* Changed text-indigo-300 to blue-300 */}
            Login here
          </button>
        </div>
    </div>
  );
};

export default AdminLogin;