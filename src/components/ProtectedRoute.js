import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { MyContext } from "./DataContext";

const ProtectedRoute = ({ children,superAdminAuth }) => {

      const { ProfileActive } = useContext(MyContext);

    const isAuthenticated = localStorage.getItem("profile_active");  
    const isSuperAdmin = sessionStorage.getItem("superadmin")
    
    if(isAuthenticated){
     return children 
    }
     else{
    return  <Navigate to="/Login" replace/>
     }

    //   if (ProfileActive || localStorage.getItem("profile_active")) {
    // return <Navigate to="/Homepage" replace />;
    //  }

    // return children;


 
};

export default ProtectedRoute;