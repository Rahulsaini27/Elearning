import axios from "axios";
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

  // Store tokens in state so they can be updated
  const [admintoken, setAdminToken] = useState(localStorage.getItem("admintoken"));
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [adminId, setAdminId] = useState(localStorage.getItem("adminId"));
  const [videos, setVideos] = useState([]);
  const [course, setCourse] = useState([]);
  const [user, setUser] = useState(null);
  const [userCourse, setUserCourse] = useState([]);
  const [totalusers, setTotalUsers] = useState([]);
  const [secureUserCourses, setSecureUserCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseLoading, setCourseLoading] = useState(true);

  const [error, setError] = useState("");

  // Listen for changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setAdminToken(localStorage.getItem("admintoken"));
      setToken(localStorage.getItem("token"));
      setUserId(localStorage.getItem("userId"));
    };

    // Listen for storage events (when localStorage changes)
    window.addEventListener('storage', handleStorageChange);
    
    // Also check for changes manually (for same-tab updates)
    const intervalId = setInterval(() => {
      const currentToken = localStorage.getItem("token");
      const currentAdminToken = localStorage.getItem("admintoken");
      const currentUserId = localStorage.getItem("userId");
      
      if (currentToken !== token) setToken(currentToken);
      if (currentAdminToken !== admintoken) setAdminToken(currentAdminToken);
      if (currentUserId !== userId) setUserId(currentUserId);
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [token, admintoken, userId]);

  // Fetch user data
  async function fetchUserData() {
    if (!userId) {
      console.error("No userId found.");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}${API_URL}${USER_BASE_URL}/getUser/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const userData = await response.json();
      setUser(userData);
      
      // Set userCourse here and then immediately fetch courses
      const enrolledCourses = userData.enrolledCourses || [];
      setUserCourse(enrolledCourses);
      
      // If there are enrolled courses, fetch them immediately
      if (enrolledCourses.length > 0) {
        await fetchCoursesForUser(enrolledCourses);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  }

  // Fetch courses
  const fetchCourse = async () => {
    if (!admintoken) return;
    setCourseLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}${API_URL}${COURSE_BASE_URL}/getCourses`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${admintoken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch courses");

      const data = await response.json();
      setCourse(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourseLoading(false);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    if (!admintoken) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}${API_URL}${USER_BASE_URL}/getUser`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${admintoken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setTotalUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);

    }
  };

  // Fetch all videos
  const fetchVideos = async () => {
    if (!admintoken) return;
    setLoading(true);

    try {
      const response = await axios.get(`${API_BASE_URL}${API_URL}${VIDEO_BASE_URL}/all-video`, {
        headers: {
          Authorization: `Bearer ${admintoken}`,
          "Content-Type": "application/json",
        },
      });
      setVideos(response.data.videos);
    } catch (err) {
      console.error("Error fetching videos:", err);
      setLoading(false);

    }
  };

  // Fetch courses for a specific user
  const fetchCoursesForUser = async (coursesToFetch = userCourse) => {
    try {
      setLoading(true);
      if (!userId || !token || !Array.isArray(coursesToFetch) || coursesToFetch.length === 0) {
        setLoading(false);
        return;
      }

      const coursePromises = coursesToFetch.map(async (course) => {
        const courseId = course._id || course.courseId;
        if (!courseId) return null;

        const response = await fetch(
          `${API_BASE_URL}${API_URL}${COURSE_BASE_URL}/${userId}/${courseId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch course ${courseId}`);
        }
        return response.json();
      });

      const courseData = await Promise.all(coursePromises);
      setSecureUserCourses(courseData.filter((data) => data).map((data) => data.course));
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to fetch courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  // Watch for token changes and trigger appropriate API calls
  useEffect(() => {
    if (admintoken) {
      fetchUsers();
      fetchCourse();
      fetchVideos();
    }
  }, [admintoken]);

  useEffect(() => {
    if (token && userId) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [token, userId]);
  
  return (
    <ProjectContext.Provider
      value={{
        API_BASE_URL,
        API_URL,
        USER_BASE_URL,
        adminId,
        setAdminId,
        ADMIN_BASE_URL,
        VIDEO_BASE_URL,
        PASSWORD_BASE_URL,
        SECURE_VIDEO_BASE_URL,
        totalusers,
        setTotalUsers,
        setCourse,
        COURSE_BASE_URL,
        user,
        course,
        videos,
        userCourse,
        secureUserCourses,
        loading,
        error,
        fetchUsers,
        fetchCourse,
        fetchUserData,
        fetchVideos,
        fetchCoursesForUser,
        // Add these functions to allow manual updating of tokens from login components
        setToken: (newToken) => {
          localStorage.setItem("token", newToken);
          setToken(newToken);
        },
        setAdminToken: (newToken) => {
          localStorage.setItem("admintoken", newToken);
          setAdminToken(newToken);
        },
        setUserId: (newId) => {
          localStorage.setItem("userId", newId);
          setUserId(newId);
        }
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export default ProjectContext;