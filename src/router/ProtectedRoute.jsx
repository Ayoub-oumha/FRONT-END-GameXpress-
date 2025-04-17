import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ roles }) => {
  const { isAuthenticated, loading, hasRole } = useAuth();

  // Show a simple loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-700"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated && !roles.includes("guest")) {
    return <Navigate to="/login" replace />;
  }

  // Check required roles
  if (roles && roles.length > 0) {
    const hasRequiredRoles = hasRole(roles);
    
    if (!hasRequiredRoles) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // User is authenticated and has required roles, render the protected route
  return <Outlet />;
};

export default ProtectedRoute;