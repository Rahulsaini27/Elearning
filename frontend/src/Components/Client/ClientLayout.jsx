import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import ClientHeader from "./ClientHeader";
import ClientSidebar from "./ClientSidebar";

export default function ClientLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <ClientHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1 pt-16">
        <ClientSidebar isOpen={isSidebarOpen} />
        <main className="flex-1 p-6 bg-white transition-all duration-300 lg:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
}