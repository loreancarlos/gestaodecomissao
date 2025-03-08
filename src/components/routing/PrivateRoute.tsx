import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

interface PrivateRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireBroker?: boolean;
  requireTeamLeader?: boolean;
}

export function PrivateRoute({
  children,
  requireAdmin = false,
  requireBroker = false,
  requireTeamLeader = false,
}: PrivateRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // If not authenticated, redirect to login with return path
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If admin access is required but user is not admin
  if (requireAdmin && user?.role == "admin") {
    return <>{children}</>;
  }

  // If broker access is required and user is not a broker
  if (requireBroker && user?.role == "broker") {
    return <>{children}</>;
  }

  // If teamLeader access is required and user is not a teamLeader
  if (requireTeamLeader && user?.role == "teamLeader") {
    return <>{children}</>;
  }

  return <Navigate to="/" replace />;
}
