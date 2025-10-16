import React from "react";
import { Navigate } from "react-router-dom";

const SuperAdminRoute = ({ children }) => {
  // Check if user is super admin
  const isSuperAdmin = localStorage.getItem("superadmin");

  if (!isSuperAdmin) {
    // not a superadmin → redirect to homepage (or login)
    return <Navigate to="/" replace />;
  }

  return children;
};

export default SuperAdminRoute;