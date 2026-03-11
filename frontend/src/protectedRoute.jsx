import React from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectAccessToken, loggedIn } from './store/auth';

function ProtectedRoute() {
  const dispatch = useDispatch();
  const token = useSelector(selectAccessToken);

  // handling browser refresh
  if (!token) {
    const accessToken = sessionStorage.getItem('access-token');
    if (!accessToken) return <Navigate to="/login" />;

    const decodedToken = jwtDecode(accessToken);
    const role = decodedToken.isAdmin ? 'Administrator' : 'User';
    const { name } = decodedToken;

    dispatch({ type: loggedIn.type, payload: { accessToken, role, name } });
    axios.defaults.headers.common['x-auth-token'] = accessToken;
  }

  return <Outlet />;
}

export default ProtectedRoute;
