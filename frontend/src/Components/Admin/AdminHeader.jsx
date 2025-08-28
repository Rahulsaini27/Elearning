

import React, { useState, useEffect, useContext } from "react";
import {
  Menu,
  Search,
  Bell,
  MessageCircle,
  Settings,
  ChevronDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AlertContext } from "../../Context/AlertContext";
import ProjectContext from "../../Context/ProjectContext";

function AdminHeader({ toggleSidebar }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const { Toast } = useContext(AlertContext);

  const { adminId, API_BASE_URL, API_URL, ADMIN_BASE_URL } = useContext(ProjectContext); // Ensure user context is handled safely
  const handleLogout = async (adminId) => {
    console.log(adminId);
    const admintoken = localStorage.getItem("admintoken");
    try {
      const response = await fetch(`${API_BASE_URL}${API_URL}${ADMIN_BASE_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admintoken}`, // Send token for authentication
        },
      });

      if (response.ok) {
        // Clear local storage after successful logout
        Toast.fire({ icon: "success", title: "Logout Successfully" });
        localStorage.removeItem("admintoken");
        navigate("/");
      } else {
        console.error("Logout failed:", await response.json());
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };



  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 h-16
      border-b border-slate-200 flex items-center justify-between
      px-4 md:px-6 bg-white/90 backdrop-blur-md
      transition-all duration-300
      ${isScrolled ? "shadow-md" : ""}
      lg:pl-[calc(16rem+1rem)]`} // Adjusted for 64px sidebar + 1rem padding
    >
      <div className="flex items-center gap-4 w-full">
        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-slate-700 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" // Adjusted colors
        >
          <Menu size={24} />
        </button>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md ml-2">
          <div className="relative w-full">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" // Adjusted color
              size={18}
            />
            <input
              type="text"
              placeholder="Search dashboard..."
              className="w-full h-10 pl-10 pr-4 rounded-full bg-slate-100 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder-slate-500" // Adjusted colors
            />
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center ml-auto gap-4">
          <div className="flex items-center gap-3">
            {/* Notification Icons (Optional: Add more specific icons if needed) */}
            <button className="relative p-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors"> {/* Adjusted colors */}
              <Bell size={20} />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span> {/* Notification dot */}
            </button>

            <button className="relative p-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors"> {/* Adjusted colors */}
              <MessageCircle size={20} />
              <span className="absolute top-0 right-0 h-2 w-2 bg-emerald-500 rounded-full"></span> {/* Message dot, changed color */}
            </button>


            {/* Profile Section */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 hover:bg-slate-100 p-2 rounded-lg transition-colors" // Adjusted hover
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium text-sm"> {/* Changed color */}
                  AD
                </div>
                <span className="text-sm font-medium hidden md:block text-slate-800">Admin</span> {/* Adjusted text color */}
                <ChevronDown size={16} className="text-slate-500" /> {/* Adjusted icon color */}
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-lg border border-slate-200 py-2 z-40 animate-fade-in-down"> {/* Added border and animation */}
                  <button
                    onClick={() => handleLogout(adminId)}
                    className="w-full cursor-pointer text-left px-4 py-2 hover:bg-slate-100 text-sm text-red-600 transition-colors"> {/* Adjusted hover and text color */}
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;