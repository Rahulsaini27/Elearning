import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AdminMain from "./Pages/Admin/AdminMain";
import DashBoard from "./Components/Admin/DashBoard";

import Dashboard from "./Components/Client/Dashboard";
import ProtectedRoute from "./Context/PrivateRoute"; // Import ProtectedRoute
import ClientLogin from "./Pages/Client/ClientLogin";
import ClientLayout from "./Components/Client/ClientLayout";
import Students from "./Components/Admin/Students";
import AdminLogin from "./Pages/Admin/AdminLogin";
import ProtectedAdminRoute from "./Context/ProtectedAdminRoute";
import ClientVideo from "./Components/Client/ClientVideo";
import NewVideo from "./Components/Admin/NewVideo";
import ClientUI from "./Pages/Client/ClientUI";

function App() {
  const routes = createBrowserRouter([
    {
      path: "/login",
      element: <ClientLogin />,
    }, 

    {
      path :"/",
      element :<ClientUI/>,
    },
    {
      path: "/client",
      element: <ProtectedRoute />, // Protect all client routes
      children: [
        {
          path: "",
          element: <ClientLayout />, 
          children: [
            { path: "", element: <Dashboard /> }, 
            { path: "course", element: <ClientVideo /> }, 
          ],
        },
      ],
    },
    
    {
          path :"/AdminLogin",
          element :<AdminLogin/>
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
              element: <DashBoard />,
            },
            {
              path: "students",
              element: <Students />,
            },
            {
              path: "new-video",
              element: <NewVideo />,
            },
          ],
        },
      ],
    },


    
   



  ]);

  return <RouterProvider router={routes} />;
}

export default App;


































// import { RouterProvider, createBrowserRouter } from "react-router-dom";
// import ClientMain from "./Pages/Client/ClientMain";
// import AdminMain from "./Pages/Admin/AdminMain";
// import DashBoard from "./Components/Admin/DashBoard";
// import Login from "./Pages/Client/Login";
// import Register from "./Pages/Client/Register";
// import Courses from "./Components/Admin/Courses";
// // import VideoUploadPage from "./Components/VideoPlayer";
// import AllVideo from "./Components/Admin/AllVideo";
// import ClientDashBoard from "./Components/Client/ClientDashBoard";
// import Dashboard from "./Components/Client/Dashboard";
// // import Students from "./Components/Admin/Students";

// function App() {



//   const routes = createBrowserRouter(
//     [
//       {
//         path: "/",
//         element: <ClientMain />,
//       },


  
//     //  {
//     //   path: "/client",
//     //   element: <ProtectedRoute />, // Protect this route
//     //   children: [
//     //     {
//     //       path: "",
//     //       element: <ClientDashBoard />,
//     //     },
//     //     {
//     //       path: "dashboard",
//     //       element: <Dashboard />,
//     //     },
//     //   ],
//     // },


//       {
//         path: "/admin",
//         element: <AdminMain />,
//         children: [
//           {
//             path: "",
//             element: <DashBoard />
//           },
//           {
//             path: "/admin/courses",
//             element: <Courses />
//           },
//           {
//             path: "/admin/all-video",
//             element: <AllVideo />
//           },
//         ]
//       },
     
//     ]
//   )
//   return (
//     <RouterProvider router={routes} />
//   );
// }

// export default App;



//  // {
//       //   path: "/login",
//       //   element: <Login />,
//       // },
//       // {
//       //   path: "/register",
//       //   element: <Register />,
//       // }






