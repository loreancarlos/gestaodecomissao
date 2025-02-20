import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface PrivateRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireBroker?: boolean;
}

export function PrivateRoute({ 
  children, 
  requireAdmin = false, 
  requireBroker = false 
}: PrivateRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // If not authenticated, redirect to login with return path
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If admin access is required but user is not admin
  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // If broker access is required and user is not a broker
  if (requireBroker && user?.role !== 'broker') {
    return <Navigate to="/" replace />;
  }

  // If broker tries to access non-broker routes
  if (user?.role === 'broker' && !requireBroker) {
    return <Navigate to="/commissions" replace />;
  }

  return <>{children}</>;
}
