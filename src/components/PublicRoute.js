import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("profile_active");

  if (isAuthenticated) {
    return <Navigate to="/Homepage" replace />;
  }

  return children;
};

export default PublicRoute;