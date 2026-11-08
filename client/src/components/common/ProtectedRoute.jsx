/**
 * @module components/common/ProtectedRoute
 * @description Redirects unauthenticated users to /login.
 * Shows a full-screen loader while checkAuth() is in progress.
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { FullScreenLoader } from './Loader.jsx';
import useAuth from '../../hooks/useAuth.js';

const ProtectedRoute = () => {
  const { user, isAuthenticated, isInitialising } = useAuth();
  const location = useLocation();

  // While the app is checking the session (on mount), show a loader
  // to prevent a flash of the login page for authenticated users.
  if (isInitialising) {
    return <FullScreenLoader />;
  }

  if (!isAuthenticated) {
    // Preserve the intended destination so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }



  // Redirect authenticated users to onboarding if they haven't completed it,
  // unless they are already on the onboarding page (admins bypass this)
  if (user && user.role !== 'admin' && !user.hasCompletedOnboarding && !location.pathname.startsWith('/onboarding')) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
