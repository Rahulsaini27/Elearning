import React, { createContext, useEffect, useState } from "react";

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const API_URL = import.meta.env.VITE_API_URL || "/api";
  const USER_BASE_URL = import.meta.env.VITE_API_USER_URL || "/user";
  const ADMIN_BASE_URL = import.meta.env.VITE_API_ADMIN_URL || "/admin";
  const VIDEO_BASE_URL = import.meta.env.VITE_API_VIDEOS_URL || "/videos";
  const PASSWORD_BASE_URL = import.meta.env.VITE_API_PASSWORD_URL || "/password";
  const COURSE_BASE_URL = import.meta.env.VITE_API_COURSE_URL || "/courses";

const SECURE_VIDEO_BASE_URL = import.meta.env.VITE_API_SECURE_VIDEO_URL || "/secureVideos";
  


  const admintoken = localStorage.getItem("admintoken");
  const token = localStorage.getItem("token");

  const [course, setCourse] = useState([]); // ✅ Initialize as an empty array
  const [user, setUser] = useState(null);
  const [userCourse, setUserCourse] = useState([]);
  const [totalusers, setTotalUsers] = useState([]);
  // Fetch user data
  async function fetchUserData() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("No userId found.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${API_URL}${USER_BASE_URL}/getUser/${userId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const userData = await response.json();
      setUser(userData);
      setUserCourse(userData.enrolledCourses);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  // Fetch courses
  const fetchCourse = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_URL}${COURSE_BASE_URL}/getCourses`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${admintoken}`,
          "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to fetch courses");

      const data = await response.json();
      setCourse(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_URL}${USER_BASE_URL}/getUser`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${admintoken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setTotalUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Run API calls when component mounts
  useEffect(() => {
    fetchUsers();
    fetchCourse();
    fetchUserData();
  }, [token, admintoken]); // ✅ Dependencies ensure updates when tokens change
 
  return (
    <ProjectContext.Provider
      value={{
        API_BASE_URL,
        API_URL,
        USER_BASE_URL,
        ADMIN_BASE_URL,
        VIDEO_BASE_URL,
        PASSWORD_BASE_URL,
        SECURE_VIDEO_BASE_URL,
        course,
        totalusers,
        setTotalUsers,
        setCourse,
        COURSE_BASE_URL,
        user,
        course,
        userCourse,
        fetchUsers,
        fetchCourse,
        fetchUserData,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export default ProjectContext;
