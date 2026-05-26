import React from "react";
import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAdmin } = useApp();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin route but user is not admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
