// src/components/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/auth';
import { hasPermission } from '../../utils/roleUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole
}) => {
  const { user, loading, userProfile } = useAuth();

  console.log(user, loading, userProfile)
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-container w-full h-screen flex items-center justify-center text-center text-white">
        <h2 className='flex items-center gap-2'>
          <div className='w-6 h-6 rounded-full border-t border-l border-white animate-spin' /> Loading...
        </h2>
        <p>Please wait while we retrieve your account information.</p>
      </div>
    );
  }

  if (!user) {
    // Save the current location to redirect back after login
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (!userProfile) {
    return (
      <div className="loading-container w-full h-screen flex flex-col gap-4 items-center justify-center text-center text-white">
        <h2 className='flex items-center gap-2'>
          <div className='w-6 h-6 rounded-full border-t border-l border-white animate-spin' /> Loading...
        </h2>
        <p>Please wait while we retrieve your account information.</p>
      </div>
    );
  }

  if (!hasPermission(userProfile.role, requiredRole)) {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
        <p>Your role: {userProfile.role}</p>
        <p>Required role: {requiredRole}</p>
        <button onClick={() => window.location.href = '/dashboard'}>
          Go to Dashboard
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;