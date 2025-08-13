// import React, { useState } from "react";
// import { Outlet } from "react-router-dom";

// import AdminHeader from "../../Components/Admin/AdminHeader";
// import AdminSidebar from "../../Components/Admin/AdminSidebar";

// function AdminMain() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const closeSidebar = () => {
//     setIsSidebarOpen(false);
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-[#f0f6f6]">
//       {/* Overlay for mobile sidebar */}
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/30 z-30 lg:hidden"
//           onClick={closeSidebar}
//         />
//       )}

//       {/* Header */}
//       <AdminHeader toggleSidebar={toggleSidebar}/>

//       <div className="flex flex-1">
//         {/* Sidebar */}
//         <AdminSidebar
//           isOpen={isSidebarOpen}
//           closeSidebar={closeSidebar} />

//         {/* Main Content */}
//         <main className="flex-1 bg-[#f0f6f6] transition-all duration-300 
//           lg:ml-64 
//           ease-in-out pt-16 p-4 md:p-6 md:pt-20">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }

// export default AdminMain;


// import React, { useState } from "react";
// import { Outlet } from "react-router-dom";

// import AdminHeader from "../../Components/Admin/AdminHeader";
// import AdminSidebar from "../../Components/Admin/AdminSidebar";

// function AdminMain() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const closeSidebar = () => {
//     setIsSidebarOpen(false);
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-slate-50"> {/* Changed background color */}
//       {/* Overlay for mobile sidebar */}
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 z-30 lg:hidden transition-opacity duration-300" // Slightly darker overlay
//           onClick={closeSidebar}
//         />
//       )}

//       {/* Header */}
//       <AdminHeader toggleSidebar={toggleSidebar}/>

//       <div className="flex flex-1">
//         {/* Sidebar */}
//         <AdminSidebar
//           isOpen={isSidebarOpen}
//           closeSidebar={closeSidebar} />

//         {/* Main Content */}
//         <main className="flex-1 bg-slate-50 transition-all duration-300 ease-in-out
//           lg:ml-64 lg:px-6 py-4 md:py-6 lg:pt-20 pt-16
//           overflow-y-auto"> {/* Adjusted padding and overflow */}
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }

// export default AdminMain;






import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminHeader from "../../Components/Admin/AdminHeader";
import AdminSidebar from "../../Components/Admin/AdminSidebar";

function AdminMain() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50"> {/* Changed background color */}
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden transition-opacity duration-300" // Slightly darker overlay
          onClick={closeSidebar}
        />
      )}

      {/* Header */}
      <AdminHeader toggleSidebar={toggleSidebar}/>

      <div className="flex flex-1">
        {/* Sidebar */}
        <AdminSidebar
          isOpen={isSidebarOpen}
          closeSidebar={closeSidebar} />

        {/* Main Content */}
        <main className="flex-1 bg-slate-50 transition-all duration-300 ease-in-out
          lg:ml-64 lg:px-6 py-4 md:py-6 lg:pt-20 pt-16
          overflow-y-auto"> {/* Adjusted padding and overflow */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminMain;