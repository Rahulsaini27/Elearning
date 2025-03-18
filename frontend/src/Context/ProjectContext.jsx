import React, { createContext, useEffect, useState } from "react";

const ProjectContext = createContext(); // ✅ Create context properly

export function ProjectProvider({ children }) { // ✅ Named export for the provider
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const API_URL = import.meta.env.VITE_API_URL || "/api";
  const USER_BASE_URL = import.meta.env.VITE_API_USER_URL || "/user";
  const ADMIN_BASE_URL = import.meta.env.VITE_API_ADMIN_URL || "/admin";
  const VIDEO_BASE_URL = import.meta.env.VITE_API_VIDEOS_URL || "/videos";


  const [user, setUser] = useState(null);
console.log(API_BASE_URL)
  useEffect(() => {
    async function fetchUserData() {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("No userId found.");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}${API_URL}${USER_BASE_URL}/getUser/${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchUserData();
  }, []);


  return (
    <ProjectContext.Provider value={{ API_BASE_URL, API_URL, USER_BASE_URL, ADMIN_BASE_URL , VIDEO_BASE_URL, user, setUser }}> {/* ✅ Provide value */}
      {children}
    </ProjectContext.Provider>
  );
}

export default ProjectContext;
