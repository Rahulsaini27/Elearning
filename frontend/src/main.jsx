import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AlertProvider } from "./Context/AlertContext.jsx";
import { ProjectProvider } from "./Context/ProjectContext.jsx"; // ✅ Import correctly

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <ProjectProvider> {/* ✅ Wrap with ProjectProvider */}
        <AlertProvider>
          <App />
        </AlertProvider>
      </ProjectProvider>
   

  </StrictMode>
);
