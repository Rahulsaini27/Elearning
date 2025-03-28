import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Video,
  Book,
  HelpCircle,
  LogOut,
} from "lucide-react";

function AdminSidebar({ isOpen, closeSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      link: "/admin",
      icon: <LayoutDashboard size={20} className="text-[#7f8c8d]" />,
    },
    {
      title: "All Students",
      link: "/admin/students",
      icon: <Users size={20} className="text-[#7f8c8d]" />,
    },
    {
      title: "Videos",
      link: "/admin/new-video",
      icon: <Video size={20} className="text-[#7f8c8d]" />,
    },
    {
      title: "Admin Courses",
      link: "/admin/admin-course",
      icon: <Book size={20} className="text-[#7f8c8d]" />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("admintoken");
    navigate("/adminlogin");
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen bg-white 
        border-r border-[#e0e0e0] flex flex-col 
        transform transition-transform 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 shadow-lg`}
    >
      <div className="p-6 border-b border-[#e0e0e0]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#4ecdc4] flex items-center justify-center text-white font-bold">
            AD
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#2c3e50]">Admin Dashboard</h2>
            <p className="text-xs text-[#7f8c8d]">Manage Your Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item, index) => (
          <Link
            to={item.link}
            key={index}
            className={`flex items-center gap-3 p-3 rounded-lg px-4 transition-colors duration-200 
              ${location.pathname === item.link 
                ? "bg-[#4ecdc4]/10 text-[#4ecdc4]" 
                : "hover:bg-[#f0f6f6] text-[#2c3e50]"}`}
          >
            {item.icon}
            <span className="text-sm font-medium">{item.title}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-[#e0e0e0]">
        <div className="bg-[#4ecdc4]/10 rounded-lg p-4 text-center">
          <HelpCircle className="mx-auto text-[#4ecdc4] mb-2" size={24} />
          <h3 className="text-sm font-semibold mb-1 text-[#2c3e50]">Help & Support</h3>
          <p className="text-xs text-[#7f8c8d] mb-3">Need assistance? We're here to help!</p>
          <button className="w-full py-2 bg-[#4ecdc4] text-white rounded-lg text-sm hover:bg-[#45b7aa] transition-colors">
            Contact Support
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-4 py-2 flex items-center justify-center gap-2 
            text-[#ff6b6b] hover:bg-[#ff6b6b]/10 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;