import React from "react";
import { useNavigate } from "react-router-dom";

function ClientSidebar({ isOpen }) {
  const navigate = useNavigate(); // Hook for navigation

  const menuItems = [
    { title: "Dashboard", link: "/client" },
    { title: "Your Course", link: "/client/course" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    localStorage.removeItem("userId"); // Remove user ID
    navigate("/login"); // Redirect to login page
  };

  return (
    <aside className={`fixed top-0 left-0 z-40 w-64 h-screen pt-16 bg-white border-r border-gray-200 transform transition-transform lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="h-full px-4 py-6 overflow-y-auto flex flex-col justify-between">
        <ul className="space-y-4 font-medium">
          {menuItems.map((item, index) => (
            <li key={index}>
              <a href={item.link} className="block p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                {item.title}
              </a>
            </li>
          ))}
        </ul>
        <div onClick={handleLogout} className=" font-medium flex  items-center justify-center hover:bg-gray-100 rounded-lg cursor-pointer">
          <h1 className="block p-3 text-gray-700 ">Log Out</h1>
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" className="h-5 w-10" viewBox="0 0 16 16"><path d="M10.95 15.84h-11V.17h11v3.88h-1V1.17h-9v13.67h9v-2.83h1v3.83z" /><path d="M5 8h6v1H5zM11 5.96l4.4 2.54-4.4 2.54V5.96z" /></svg>
        </div>
      </div>
    </aside>
  );
}

export default ClientSidebar;
