import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AdminMain from "./Pages/Admin/AdminMain";

import ProtectedRoute from "./Context/PrivateRoute"; // Import ProtectedRoute
import ClientLogin from "./Pages/Client/ClientLogin";
import ClientLayout from "./Components/Client/ClientLayout";
import Students from "./Components/Admin/Students";
import AdminLogin from "./Pages/Admin/AdminLogin";
import ProtectedAdminRoute from "./Context/ProtectedAdminRoute";
import ClientUI from "./Pages/Client/ClientUI";
import ForgetPassword from "./Pages/Client/ForgetPassword";
import AdminCourse from "./Components/Admin/AdminCourse";
import Coursevideo from "./Components/Admin/Coursevideo";
import ClientCourse from "./Components/Client/ClientCourse";
import ClientDashboard from "./Components/Client/ClientDashboard";
import LearningVideo from "./Components/Client/LearningVideo";
import ClientTest from "./Components/Client/ClientTest";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import AdminVideo from "./Components/Admin/AdminVideo";
import ClientProfile from "./Components/Client/ClientProfile";

function App() {

  const routes = createBrowserRouter([
    {
      path: "/login",
      element: <ClientLogin />,
    },
    {
      path: "/forgot-password",
      element: <ForgetPassword />,
    },
    {
      path: "/",
      element: <ClientUI />,
    },
    {
      path: "/client",
      element: <ProtectedRoute />, // Protect all client routes
      children: [
        {
          path: "",
          element: <ClientLayout />,
          children: [
            { path: "", element: <ClientDashboard /> },
            { path: "course", element: <ClientCourse /> },
            { path: "my-profile", element: <ClientProfile /> },

            { path: "course/:courseId", element: <LearningVideo /> },
            { path: "upload-video", element: <ClientTest /> },

          ],
        },
      ],
    },
    {
      path: "/AdminLogin",
      element: <AdminLogin />
    },


    {
      path: "/admin",
      element: <ProtectedAdminRoute />,
      children: [
        {
          path: "",
          element: <AdminMain />,
          children: [
            {
              path: "",
              element: <AdminDashboard />,
            },
            {
              path: "students",
              element: <Students />,
            },
            {
              path: "new-video",
              element: <AdminVideo />,
            },
          
            {
              path: "Admin-course",
              element: <AdminCourse />
            },
            {
              path: "Admin-course/videos/:courseId",
              element: <Coursevideo />
            }
            
          ],
        },
      ],
    },

  ]);

  return <RouterProvider router={routes} />;
}

export default App;
































