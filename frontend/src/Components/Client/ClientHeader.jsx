import React, { useContext, useEffect, useState } from "react";
import ProjectContext from "../../Context/ProjectContext";

function ClientHeader({ toggleSidebar }) {
  const { user } = useContext(ProjectContext);
  const [client, setClient] = useState()
  useEffect(() => {

    setClient(user)


  }, [user])

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 shadow-md">
      <div className="px-4 lg:px-6 flex items-center justify-between h-16">
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-500 rounded-lg lg:hidden focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <a href="/client" className="flex items-center">
          <img src="https://www.requingroup.com/logo.png" alt="Logo" className="h-16 max-w-[150px]" />
        </a>
        <div className="text-gray-700 font-medium lg:block hidden">{client?.name}</div>
      </div>
    </nav>
  );
}

export default ClientHeader;