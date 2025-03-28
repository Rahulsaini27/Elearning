import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Menu,
  Search,
  Bell,
  MessageCircle,
  Settings,
  ChevronDown
} from "lucide-react";
import ProjectContext from "../../Context/ProjectContext";
import { useNavigate } from "react-router-dom";

function ClientHeader({ toggleSidebar }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { user } = useContext(ProjectContext); // Ensure user context is handled safely

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isProfileDropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 h-16 
      border-b border-gray-200 flex items-center justify-between 
      px-4 md:px-6 bg-white/90 backdrop-blur-md 
      transition-all duration-300 
      ${isScrolled ? "shadow-md" : ""} 
      lg:pl-[calc(16rem+1rem)]`}
    >
      <div className="flex items-center gap-4 w-full">
        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          <Menu size={24} />
        </button>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md ml-2">
          <div className="relative w-full">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search dashboard..."
              className="w-full h-10 pl-10 pr-4 rounded-full bg-gray-100 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center ml-auto gap-4">
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative p-2 text-gray-800 hover:bg-gray-100 rounded-full">
              <Bell size={20} />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            <button className="relative p-2 text-gray-800 hover:bg-gray-100 rounded-full">
              <MessageCircle size={20} />
              <span className="absolute top-0 right-0 h-2 w-2 bg-teal-400 rounded-full"></span>
            </button>

            <button className="p-2 text-gray-800 hover:bg-gray-100 rounded-full">
              <Settings size={20} />
            </button>

            {/* Profile Section */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg"
              >
                <div className="w-8 h-8 rounded-full bg-teal-400 flex items-center justify-center text-white font-medium">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="text-sm font-medium hidden md:block text-gray-800">
                  {user?.name || "User"}
                </span>
                <ChevronDown size={16} className="text-gray-600" />
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 py-2">
                  <button onClick={() => navigate("/client/my-profile")} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-800">
                   My Profile
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-800">
                    Settings
                  </button>
                  <div className="border-t my-2 "></div>
                  <button onClick={handleLogout}
                    className="w-full cursor-pointer text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-500">
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

export default ClientHeader;
