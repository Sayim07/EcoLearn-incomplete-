// Protected route component for authentication
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/DemoAuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser, userData, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirect to home if not authenticated
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // Check admin access if required
  if (adminOnly && userData?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
