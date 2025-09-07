import React, { useState, useEffect, useContext } from "react";
import { Menu, Search, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AlertContext } from "../../Context/AlertContext";
import ProjectContext from "../../Context/ProjectContext";

function AdminHeader({ toggleSidebar }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { Toast } = useContext(AlertContext);
  const { adminId, API_BASE_URL, API_URL, ADMIN_BASE_URL } = useContext(ProjectContext);

  const handleLogout = async () => {
    const admintoken = localStorage.getItem("admintoken");
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_URL}${ADMIN_BASE_URL}/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${admintoken}`,
          },
        }
      );

      if (response.ok) {
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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 h-16
      border-b border-slate-200 flex items-center justify-between
      px-4 md:px-6 bg-white/90 backdrop-blur-md
      transition-all duration-300
      ${isScrolled ? "shadow-md" : ""}
      lg:pl-[calc(16rem+1rem)]`}
    >
      <div className="flex items-center gap-4 w-full pr-5">
        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-gray-700 rounded-full hover:bg-gray-100"
        >
          <Menu size={24} />
        </button>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-xs ">
          <Search
            className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-12 pl-12 pr-4 rounded-full bg-gray-100 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
          />
        </div>

        {/* Right Side Icons & Profile */}
        <div className="flex items-center ml-auto gap-4">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <Bell size={22} />
            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-orange-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-full"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                A
              </div>
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 top-full mt-3 w-48 bg-white shadow-2xl rounded-xl border border-gray-100 py-2 z-40">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-100 text-sm text-red-600 font-medium"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
