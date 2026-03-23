import React from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectAccessToken, loggedIn, selectUserRole } from './store/auth';

/**
 * ProtectedRoute — wraps any set of routes that require authentication.
 *
 * Props (optional):
 *   allowedRoles  string[]  — if provided, only these roles can access
 *   redirectTo    string    — where to send unauthorised users (default: /login)
 */
interface ProtectedRouteProps {
  allowedRoles?: string[];
  redirectTo?: string;
}

function ProtectedRoute({ allowedRoles, redirectTo = '/login' }: ProtectedRouteProps) {
  const dispatch = useDispatch();
  const token = useSelector(selectAccessToken);
  const role = useSelector(selectUserRole);

  // Handle browser refresh: Redux state is lost, sessionStorage has the token
  let activeToken = token;
  if (!activeToken) {
    const stored = sessionStorage.getItem('access-token');
    if (!stored) return <Navigate to={redirectTo} replace />;
    dispatch({ type: loggedIn.type, payload: { accessToken: stored } });
    axios.defaults.headers.common['x-auth-token'] = stored;
    activeToken = stored;
  }

  // Role gate — if allowedRoles is set, enforce it
  if (allowedRoles && allowedRoles.length > 0) {
    // Role might be determined after re-hydration; give it a tick via selector
    if (role && !allowedRoles.includes(role)) {
      // Redirect to the appropriate home for their actual role
      if (role === 'ADMIN') return <Navigate to="/dashboard" replace />;
      if (role === 'INSTRUCTOR') return <Navigate to="/instructor" replace />;
      return <Navigate to="/explore" replace />;
    }
  }

  return <Outlet />;
}

export default ProtectedRoute;
