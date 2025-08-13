// import React, { useContext, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Users,
//   Video,
//   Book,
//   HelpCircle,
//   LogOut,
//   FileText,
// } from "lucide-react";
// import ProjectContext from "../../Context/ProjectContext";
// import { AlertContext } from "../../Context/AlertContext";

// function AdminSidebar({ isOpen, closeSidebar }) {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const menuItems = [
//     {
//       title: "Dashboard",
//       link: "/admin",
//       icon: <LayoutDashboard size={20} className="text-current" />, // text-current inherits parent color
//     },
//     {
//       title: "All Students",
//       link: "/admin/students",
//       icon: <Users size={20} className="text-current" />,
//     },
//     {
//       title: "Videos",
//       link: "/admin/new-video",
//       icon: <Video size={20} className="text-current" />,
//     },
//     {
//       title: "Admin Courses",
//       link: "/admin/admin-course",
//       icon: <Book size={20} className="text-current" />,
//     },
//      { // --- NEW MENU ITEM ---
//       title: "Assignments",
//       link: "/admin/assignments", // <-- New path
//       icon: <FileText size={20} className="text-current" />, // Choose an appropriate icon
//     },
//   ];




//   const { Toast } = useContext(AlertContext);

//   const { adminId, API_BASE_URL, API_URL, ADMIN_BASE_URL } = useContext(ProjectContext); // Ensure user context is handled safely
//   const handleLogout = async (adminId) => {
//     console.log(adminId);
//     const admintoken = localStorage.getItem("admintoken");
//     try {
//       const response = await fetch(`${API_BASE_URL}${API_URL}${ADMIN_BASE_URL}/logout`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${admintoken}`, // Send token for authentication
//         },
//       });

//       if (response.ok) {
//         // Clear local storage after successful logout
//         Toast.fire({ icon: "success", title: "Logout Successfully" });
//         localStorage.removeItem("admintoken");
//         navigate("/adminlogin");
//       } else {
//         console.error("Logout failed:", await response.json());
//       }
//     } catch (error) {
//       console.error("Error logging out:", error);
//     }
//   };

//   return (
//     <aside
//       className={`fixed top-0 left-0 z-40 w-64 h-screen bg-white
//         border-r border-slate-200 flex flex-col
//         transform transition-transform duration-300
//         ${isOpen ? "translate-x-0" : "-translate-x-full"}
//         lg:translate-x-0 shadow-lg`} // Changed border color, added duration
//     >
//       <div className="p-6 border-b border-slate-200"> {/* Changed border color */}
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg"> {/* Changed color */}
//             AD
//           </div>
//           <div>
//             <h2 className="text-base font-semibold text-slate-800">Admin Dashboard</h2> {/* Adjusted text color and size */}
//             <p className="text-xs text-slate-500">Manage Your Platform</p> {/* Adjusted text color */}
//           </div>
//         </div>
//       </div>

//       <nav className="flex-1 overflow-y-auto py-4 px-3"> {/* Added horizontal padding */}
//         {menuItems.map((item, index) => (
//           <Link
//             to={item.link}
//             key={index}
//             onClick={closeSidebar} // Close sidebar on nav item click for mobile
//             className={`flex items-center gap-3 p-3 rounded-lg px-3 transition-colors duration-200 mb-2
//               ${location.pathname === item.link
//                 ? "bg-indigo-500/10 text-indigo-600 font-semibold" // Changed active state colors
//                 : "hover:bg-slate-100 text-slate-700"}`} // Changed hover and default text colors
//           >
//             {item.icon}
//             <span className="text-sm font-medium">{item.title}</span>
//           </Link>
//         ))}
//       </nav>

//       <div className="p-4 border-t border-slate-200"> {/* Changed border color */}
//         <div className="bg-emerald-500/10 rounded-lg p-4 text-center"> {/* Changed background color */}
//           <HelpCircle className="mx-auto text-emerald-600 mb-2" size={24} /> {/* Changed icon color */}
//           <h3 className="text-sm font-semibold mb-1 text-slate-800">Help & Support</h3> {/* Adjusted text color */}
//           <p className="text-xs text-slate-600 mb-3">Need assistance? We're here to help!</p> {/* Adjusted text color */}
//           <button className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors shadow-md"> {/* Changed button color */}
//             Contact Support
//           </button>
//         </div>

//         <button
//           onClick={() => handleLogout(adminId)}
//           className="w-full mt-4 py-2 flex items-center justify-center gap-2
//             text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer font-medium" // Changed colors
//         >
//           <LogOut size={18} />
//           <span className="text-sm">Logout</span>
//         </button>
//       </div>
//     </aside>
//   );
// }

// export default AdminSidebar;



import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Video,
  Book,
  HelpCircle,
  LogOut,
  FileText,
  Lightbulb,
} from "lucide-react";
import ProjectContext from "../../Context/ProjectContext";
import { AlertContext } from "../../Context/AlertContext";

function AdminSidebar({ isOpen, closeSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      link: "/admin",
      icon: <LayoutDashboard size={20} className="text-current" />, // text-current inherits parent color
    },
    {
      title: "All Students",
      link: "/admin/students",
      icon: <Users size={20} className="text-current" />,
    },
    {
      title: "Videos",
      link: "/admin/new-video",
      icon: <Video size={20} className="text-current" />,
    },
    {
      title: "Admin Courses",
      link: "/admin/admin-course",
      icon: <Book size={20} className="text-current" />,
    },
     { // --- EXISTING MENU ITEM ---
      title: "Assignments Overview", // Renamed for clarity
      link: "/admin/assignments", 
      icon: <FileText size={20} className="text-current" />,
    },
    { // --- NEW MENU ITEM ---
        title: "Generate Assignment",
        link: "/admin/generate-assignment", 
        icon: <Lightbulb size={20} className="text-current" />, // Using Lightbulb for AI generation
    },
  ];




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

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen bg-white
        border-r border-slate-200 flex flex-col
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 shadow-lg`} // Changed border color, added duration
    >
      <div className="p-6 border-b border-slate-200"> {/* Changed border color */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg"> {/* Changed color */}
            LearnHub
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">Admin Dashboard</h2> {/* Adjusted text color and size */}
            <p className="text-xs text-slate-500">Manage Your Platform</p> {/* Adjusted text color */}
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3"> {/* Added horizontal padding */}
        {menuItems.map((item, index) => (
          <Link
            to={item.link}
            key={index}
            onClick={closeSidebar} // Close sidebar on nav item click for mobile
            className={`flex items-center gap-3 p-3 rounded-lg px-3 transition-colors duration-200 mb-2
              ${location.pathname === item.link
                ? "bg-indigo-500/10 text-indigo-600 font-semibold" // Changed active state colors
                : "hover:bg-slate-100 text-slate-700"}`} // Changed hover and default text colors
          >
            {item.icon}
            <span className="text-sm font-medium">{item.title}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200"> {/* Changed border color */}
        
        <button
          onClick={() => handleLogout(adminId)}
          className="w-full mt-4 py-2 flex items-center justify-center gap-2
            text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer font-medium" // Changed colors
        >
          <LogOut size={18} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
