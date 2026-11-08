/**
 * @module hooks/useAuth
 * @description Convenience hook for reading authentication state from Redux.
 */

import { useSelector, useDispatch } from 'react-redux';
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectIsInitialising,
  selectAuthError,
  clearError,
} from '../store/slices/authSlice.js';

const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const isInitialising = useSelector(selectIsInitialising);
  const error = useSelector(selectAuthError);

  return {
    user,
    isAuthenticated,
    isLoading,
    isInitialising,
    error,
    clearError: () => dispatch(clearError()),
  };
};

export default useAuth;
