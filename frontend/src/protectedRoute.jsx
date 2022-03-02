import React from 'react';
import axios from 'axios';
import jwt from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectLoginStatus, loggedIn } from './store/auth';

function ProtectedRoute() {
  const auth = useSelector(selectLoginStatus);
  const dispatch = useDispatch();

  if (!auth) {
    const accessToken = sessionStorage.getItem('access-token');
    console.log(accessToken);

    if (!accessToken) {
      return <Navigate to="/login" />;
    }

    try {
      const decoded = jwt(accessToken);
      // if (decoded.aud !== process.env.REACT_APP_CLIENT_ID) {
      //   throw new Error('decode failed');
      // }
    } catch (error) {
      return <Navigate to="/login" />;
    }

    dispatch({
      type: loggedIn.type,
      payload: { accessToken }
    });
    axios.defaults.headers.common['x-auth-token'] = accessToken;
    return <Outlet />;
  }

  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  return <Outlet />;
}

export default ProtectedRoute;
