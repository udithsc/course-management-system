import React from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectAccessToken, loggedIn } from './store/auth';

function ProtectedRoute() {
  const dispatch = useDispatch();
  const token = useSelector(selectAccessToken);

  // Handle browser refresh: Redux state is lost, but sessionStorage still has the token
  if (!token) {
    const accessToken = sessionStorage.getItem('access-token');
    if (!accessToken) return <Navigate to="/login" />;

    // Re-hydrate Redux state — loggedIn will decode the JWT to extract user info
    dispatch({ type: loggedIn.type, payload: { accessToken } });
    axios.defaults.headers.common['x-auth-token'] = accessToken;
  }

  return <Outlet />;
}

export default ProtectedRoute;
