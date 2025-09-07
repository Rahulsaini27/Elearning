import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Video,
  BookOpen,
  LogOut,
  Award,
  Book
} from "lucide-react";
import ProjectContext from "../../Context/ProjectContext";
import { AlertContext } from "../../Context/AlertContext";

function ClientSidebar({ isOpen, closeSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { API_BASE_URL, API_URL, USER_BASE_URL } = useContext(ProjectContext);
  const { Toast } = useContext(AlertContext);

  const menuItems = [
    { title: "Dashboard", link: "/client", icon: <LayoutDashboard size={20} /> },
    { title: "My Courses", link: "/client/course", icon: <Book size={20} /> },
    { title: "Assignment Results", link: "/client/assignment-results", icon: <Award size={20} /> },
    { title: "Your Test", link: "/client/upload-video", icon: <Video size={20} /> },
  ];

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}${API_URL}${USER_BASE_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        Toast.fire({ icon: "success", title: "Logout Successful" });
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/");
      } else {
        Toast.fire({ icon: "error", title: "Logout Failed" });
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-50 w-64 h-screen bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      <div className="p-6 border-b border-gray-200 flex items-center gap-3">
        <BookOpen className="h-10 w-10 text-white bg-blue-500 p-2 rounded-lg" />
        <div>
          <h2 className="text-xl font-bold text-gray-900">LearnHub</h2>
          <p className="text-sm text-gray-500">Student Panel</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            to={item.link}
            key={item.link}
            onClick={closeSidebar}
            className={`flex items-center gap-4 p-3 rounded-lg transition-colors duration-200 ${location.pathname === item.link ? "bg-blue-500 text-white shadow-md" : "hover:bg-gray-100 text-gray-600"}`}
          >
            {item.icon}
            <span className="text-sm font-semibold">{item.title}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full py-3 flex items-center justify-center gap-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors font-semibold"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default ClientSidebar;