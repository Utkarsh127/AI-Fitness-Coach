/**
 * @module components/common/PublicRoute
 * @description Redirects already-authenticated users to /dashboard.
 */

import { Navigate, Outlet } from 'react-router-dom';
import { FullScreenLoader } from './Loader.jsx';
import useAuth from '../../hooks/useAuth.js';

const PublicRoute = () => {
  const { user, isAuthenticated, isInitialising } = useAuth();

  if (isInitialising) {
    return <FullScreenLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
