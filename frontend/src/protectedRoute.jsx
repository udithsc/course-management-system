import React from 'react';
import axios from 'axios';
import decode from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectAccessToken, loggedIn } from './store/auth';

function ProtectedRoute() {
  const dispatch = useDispatch();
  const token = useSelector(selectAccessToken);
  // const token = true;

  // handling browser refresh
  if (!token) {
    const accessToken = sessionStorage.getItem('access-token');
    if (!accessToken) return <Navigate to="/login" />;

    const decodedToken = decode(accessToken);
    const role = decodedToken.isAdmin ? 'Administrator' : 'User';
    const { name } = decodedToken;

    // if (decodedToken.aud !== process.env._CLIENT_ID) return <Navigate to="/login" />;

    dispatch({ type: loggedIn.type, payload: { accessToken, role, name } });
    axios.defaults.headers.common['x-auth-token'] = accessToken;
  }

  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  return <Outlet />;
}

export default ProtectedRoute;
