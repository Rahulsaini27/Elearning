import React, { createContext } from "react";
import Swal from "sweetalert2";

const AlertContext = createContext();

function AlertProvider({ children }) {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });



  return (
    <AlertContext.Provider value={{ Toast }}>
      {children}
    </AlertContext.Provider>
  );
}

export { AlertContext, AlertProvider };
