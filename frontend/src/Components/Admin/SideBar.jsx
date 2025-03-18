import React from "react";
import { useNavigate } from "react-router-dom";

export default function SideBar({ isOpen }) {
    const navigate = useNavigate(); // Hook for navigation

    const menuItems = [
        { title: "Dashboard", link: "/admin", icon: "M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" },
        { title: "All Students", link: "/admin/students", icon: "M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Z" },
        // { title: "All Video", link: "/admin/all-video", icon: "m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" },
        // { title: "Testing", link: "/admin/testing", icon: "M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Z" },
        { title: "Course Videos", link: "/admin/new-video", icon: "M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" },

    ];


    const handleLogout = () => {
        localStorage.removeItem("admintoken"); // Remove token
        // localStorage.removeItem("userId"); // Remove user ID
        navigate("/adminlogin"); // Redirect to login page
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

