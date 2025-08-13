// import React, { useContext } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Users,
//   Video,
//   Book,
//   HelpCircle,
//   LogOut,
//   BookOpen,
//   Award
// } from "lucide-react";
// import ProjectContext from "../../Context/ProjectContext";
// import { AlertContext } from "../../Context/AlertContext";

// function ClientSidebar({ isOpen, closeSidebar }) {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, API_BASE_URL, API_URL, USER_BASE_URL } = useContext(ProjectContext); // Ensure user context is handled safely
//   const { Toast } = useContext(AlertContext);


//   const menuItems = [
//     {
//       title: "Dashboard",
//       link: "/client",
//       icon: <LayoutDashboard size={20} className="text-[#7f8c8d]" />
//     },
//     {
//       title: "My Courses",
//       link: "/client/course",
//       icon: <BookOpen size={20} className="text-[#7f8c8d]" />
//     },
//      {
//       title: "Assignment Results", // NEW: Menu item title
//       link: "/client/assignment-results", // NEW: Link path
//       icon: <Award size={20} className="text-[#7f8c8d]" /> // NEW: Icon for assignment results
//     },
//     {
//       title: "Your Test",
//       link: "/client/upload-video",
//       icon: <Video size={20} className="text-[#7f8c8d]" />
//     }
//   ];


//   const handleLogout = async (userId) => {
//     console.log(userId);
//     const token = localStorage.getItem("token");
//     try {
//       const response = await fetch(`${API_BASE_URL}${API_URL}${USER_BASE_URL}/logout`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`, // Send token for authentication
//         },
//       });

//       if (response.ok) {
//         // Clear local storage after successful logout
//         Toast.fire({ icon: "success", title: "Logout Successfully" });

//         localStorage.removeItem("token");
//         localStorage.removeItem("userId");

//         navigate("/login"); // Redirect to login page
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
//         border-r border-[#e0e0e0] flex flex-col 
//         transform transition-transform 
//         ${isOpen ? "translate-x-0" : "-translate-x-full"} 
//         lg:translate-x-0 shadow-lg`}
//     >
//       <div className="p-6 border-b border-[#e0e0e0]">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-full bg-[#4ecdc4] flex items-center justify-center text-white font-bold">
//             {user?.name?.charAt(0)?.toUpperCase() || "CL"}

//           </div>
//           <div>
//             <h2 className="text-sm font-semibold text-[#2c3e50]">Your Dashboard</h2>
//             <p className="text-xs text-[#7f8c8d]">Manage Your Platform</p>
//           </div>
//         </div>
//       </div>

//       <nav className="flex-1 overflow-y-auto py-4">
//         {menuItems.map((item, index) => (
//           <Link
//             to={item.link}
//             key={index}
//             className={`flex items-center gap-3 p-3 rounded-lg px-4 transition-colors duration-200 
//               ${location.pathname === item.link
//                 ? "bg-[#4ecdc4]/10 text-[#4ecdc4]"
//                 : "hover:bg-[#f0f6f6] text-[#2c3e50]"}`}
//           >
//             {item.icon}
//             <span className="text-sm font-medium">{item.title}</span>
//           </Link>
//         ))}
//       </nav>

//       <div className="p-4 border-t border-[#e0e0e0]">
//         <div className="bg-[#4ecdc4]/10 rounded-lg p-4 text-center">
//           <HelpCircle className="mx-auto text-[#4ecdc4] mb-2" size={24} />
//           <h3 className="text-sm font-semibold mb-1 text-[#2c3e50]">Help & Support</h3>
//           <p className="text-xs text-[#7f8c8d] mb-3">Need assistance? We're here to help!</p>
//           <button className="w-full py-2 bg-[#4ecdc4] text-white rounded-lg text-sm hover:bg-[#45b7aa] transition-colors">
//             Contact Support
//           </button>
//         </div>

//         <button
//           onClick={() => handleLogout(user._id)}
//           className="w-full mt-4 py-2 flex items-center justify-center gap-2 
//             text-[#ff6b6b] hover:bg-[#ff6b6b]/10 rounded-lg transition-colors"
//         >
//           <LogOut size={18} />
//           <span className="text-sm font-medium">Logout</span>
//         </button>
//       </div>
//     </aside>
//   );
// }

// export default ClientSidebar;



import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Video,
  Book,
  HelpCircle,
  LogOut,
  BookOpen,
  Award
} from "lucide-react";
import ProjectContext from "../../Context/ProjectContext";
import { AlertContext } from "../../Context/AlertContext";

function ClientSidebar({ isOpen, closeSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, API_BASE_URL, API_URL, USER_BASE_URL } = useContext(ProjectContext); // Ensure user context is handled safely
  const { Toast } = useContext(AlertContext);


  const menuItems = [
    {
      title: "Dashboard",
      link: "/client",
      icon: <LayoutDashboard size={20} className="text-current" /> // text-current inherits color from parent
    },
    {
      title: "My Courses",
      link: "/client/course",
      icon: <BookOpen size={20} className="text-current" />
    },
     {
      title: "Assignment Results", // NEW: Menu item title
      link: "/client/assignment-results", // NEW: Link path
      icon: <Award size={20} className="text-current" /> // NEW: Icon for assignment results
    },
    {
      title: "Your Test",
      link: "/client/upload-video",
      icon: <Video size={20} className="text-current" />
    }
  ];


  const handleLogout = async (userId) => {
    console.log(userId);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}${API_URL}${USER_BASE_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token for authentication
        },
      });

      if (response.ok) {
        // Clear local storage after successful logout
        Toast.fire({ icon: "success", title: "Logout Successfully" });

        localStorage.removeItem("token");
        localStorage.removeItem("userId");

        navigate("/login"); // Redirect to login page
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
        transform transition-transform 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 shadow-lg`}
    >
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
            {user?.name?.charAt(0)?.toUpperCase() || "CL"}

          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">Your Dashboard</h2>
            <p className="text-xs text-slate-500">Manage Your Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {menuItems.map((item, index) => (
          <Link
            to={item.link}
            key={index}
            onClick={closeSidebar} // Close sidebar on nav item click for mobile
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 mb-2
              ${location.pathname === item.link
                ? "bg-indigo-500/10 text-indigo-600 font-semibold"
                : "hover:bg-slate-100 text-slate-700"}`}
          >
            {item.icon}
            <span className="text-sm font-medium">{item.title}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="bg-emerald-500/10 rounded-lg p-4 text-center">
          <HelpCircle className="mx-auto text-emerald-600 mb-2" size={24} />
          <h3 className="text-sm font-semibold mb-1 text-slate-800">Help & Support</h3>
          <p className="text-xs text-slate-600 mb-3">Need assistance? We're here to help!</p>
          <button className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors shadow-md">
            Contact Support
          </button>
        </div>

        <button
          onClick={() => handleLogout(user._id)}
          className="w-full mt-4 py-2 flex items-center justify-center gap-2 
            text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer font-medium"
        >
          <LogOut size={18} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default ClientSidebar;