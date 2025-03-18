import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import ProjectContext from "./ProjectContext";

const ProtectedAdminRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const {API_BASE_URL ,API_URL ,ADMIN_BASE_URL } = useContext (ProjectContext)

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("admintoken");
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch( API_BASE_URL + API_URL +  ADMIN_BASE_URL + "/verify-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem("admintoken"); // Clear invalid token
        }
      } catch (error) {
        console.log(error )
        setIsAuthenticated(false);
        localStorage.removeItem("admintoken");
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/adminlogin" replace />;
};

export default ProtectedAdminRoute;
