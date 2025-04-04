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
        navigate("/adminlogin");
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
      border-b border-[#e0e0e0] flex items-center justify-between 
      px-4 md:px-6 bg-white/90 backdrop-blur-md
      transition-all duration-300 
      ${isScrolled ? "shadow-md" : ""}
      lg:pl-[calc(16rem+1rem)]`}
    >
      <div className="flex items-center gap-4 w-full">
        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-[#2c3e50] rounded-lg hover:bg-[#f0f6f6] focus:outline-none focus:ring-2 focus:ring-[#4ecdc4]"
        >
          <Menu size={24} />
        </button>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md ml-2">
          <div className="relative w-full">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7f8c8d]"
              size={18}
            />
            <input
              type="text"
              placeholder="Search dashboard..."
              className="w-full h-10 pl-10 pr-4 rounded-full bg-[#f0f6f6] border border-[#e0e0e0] text-sm focus:outline-none focus:ring-2 focus:ring-[#4ecdc4]"
            />
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center ml-auto gap-4">
          <div className="flex items-center gap-3">
            {/* Notification Icons */}


            <button className="relative p-2 text-[#2c3e50] hover:bg-[#f0f6f6] rounded-full">
              <MessageCircle size={20} />
              <span className="absolute top-0 right-0 h-2 w-2 bg-[#4ecdc4] rounded-full"></span>
            </button>


            {/* Profile Section */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 hover:bg-[#f0f6f6] p-2 rounded-lg"
              >
                <div className="w-8 h-8 rounded-full bg-[#4ecdc4] flex items-center justify-center text-white font-medium">
                  AD
                </div>
                <span className="text-sm font-medium hidden md:block text-[#2c3e50]">Admin</span>
                <ChevronDown size={16} className="text-[#7f8c8d]" />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-lg border border-[#e0e0e0] py-2">

                  <button
                    onClick={() => handleLogout(adminId)}
                    className="w-full cursor-pointer text-left px-4 py-2 hover:bg-[#f0f6f6] text-sm text-[#ff6b6b]">
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