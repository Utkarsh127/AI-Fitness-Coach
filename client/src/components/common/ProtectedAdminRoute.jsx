/**
 * @module components/common/ProtectedAdminRoute
 * @description Redirects non-admin authenticated users to /dashboard.
 */

import { Navigate, Outlet } from 'react-router-dom';
import { FullScreenLoader } from './Loader.jsx';
import useAuth from '../../hooks/useAuth.js';

const ProtectedAdminRoute = () => {
  const { user, isAuthenticated, isInitialising } = useAuth();

  if (isInitialising) {
    return <FullScreenLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
