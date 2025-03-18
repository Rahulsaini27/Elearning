import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../../Components/Admin/Header";
import SideBar from "../../Components/Admin/SideBar";



function AdminMain() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (

    <div className="flex flex-col min-h-screen">
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1 pt-16">
        <SideBar isOpen={isSidebarOpen} />
        <main className="flex-1 p-6 bg-white transition-all duration-300 lg:ml-64">
          <Outlet />
        </main>
      </div>
    </div>

  );
}

export default AdminMain;
