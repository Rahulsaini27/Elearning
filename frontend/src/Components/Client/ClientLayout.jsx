

import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import ClientHeader from "./ClientHeader";
import ClientSidebar from "./ClientSidebar";

function ClientLayout() {
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Header */}
      <ClientHeader toggleSidebar={toggleSidebar}/>

      <div className="flex flex-1">
        {/* Sidebar */}
        <ClientSidebar
          isOpen={isSidebarOpen}
          closeSidebar={closeSidebar} />

        {/* Main Content */}
        <main className="flex-1 bg-slate-50 transition-all duration-300 
          lg:ml-64 
          ease-in-out pt-16 p-4 md:p-6 md:pt-20">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default ClientLayout;
