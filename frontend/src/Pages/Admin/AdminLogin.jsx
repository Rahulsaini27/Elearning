import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AlertContext } from "../../Context/AlertContext";
import ProjectContext from "../../Context/ProjectContext";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { Toast } = useContext(AlertContext);
  const {API_BASE_URL ,API_URL ,ADMIN_BASE_URL } = useContext (ProjectContext)


  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Login Submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        API_BASE_URL + API_URL + ADMIN_BASE_URL + "/login",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem("admintoken", data.admintoken);



      setTimeout(() => navigate("/admin"), 2000);
      Toast.fire({
        icon: "success",
        title: "Login Successfully"

      });
    } catch (error) {
      const errorMsg = error.response?.data?.msg || "Invalid credentials";
      Toast.fire({
        icon: "error",
        title: "Login Failed",
        text: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4">
          <div className="flex justify-center">
            <img className="h-24" src="https://www.requingroup.com/logo.png" alt="Logo" />
          </div>

          <h3 className="mt-3 text-xl font-medium text-center text-gray-600">
            Welcome Back
          </h3>
          <p className="mt-1 text-center text-gray-500">Log in admin account</p>

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            <div className="mt-4">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-blue-300 focus:border-blue-400 focus:outline-none"
                required
              />
            </div>

            <div className="mt-4">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-blue-300 focus:border-blue-400 focus:outline-none"
                required
              />
            </div>

            <div className="flex items-center justify-between mt-4">
              <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-gray-500">
                Forgot Password?
              </Link>

              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium tracking-wide text-white bg-blue-500 rounded-lg hover:bg-blue-400 focus:ring focus:ring-blue-300 focus:outline-none"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>
        </div>


      </div>
    </div>
  );
};

export default AdminLogin;
