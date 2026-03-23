import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { apiCallBegan } from './api';

interface CustomJwtPayload extends Object {
  id?: string | number;
  name?: string;
  email?: string;
  role?: string;
  isAdmin?: boolean;
}

const initialState = {
  isLoading: false,
  accessToken: '',
  refreshToken: '',
  user: {},
  permissions: {
    admin: ['APPROVE', 'DELETE'],
    user: ['CREATE', 'UPDATE', 'DELETE'],
  },
  notification: {
    isOpen: false,
    message: '',
    type: '',
  },
  message: '',
  isSignUp: false,
};

/**
 * Extract the raw access token string from the action payload.
 *
 * Two shapes exist:
 *  1. Via API middleware:  payload = response.data = { success, data: { accessToken, refreshToken } }
 *  2. Via ProtectedRoute manual dispatch: payload = { accessToken }
 *
 * We detect shape (1) by checking for payload.data.
 */
function extractToken(payload) {
  if (payload?.data?.accessToken) return payload.data.accessToken; // API middleware shape
  return payload?.accessToken ?? ''; // manual dispatch shape
}

function extractRefreshToken(payload) {
  if (payload?.data?.refreshToken) return payload.data.refreshToken;
  return payload?.refreshToken ?? '';
}

/** Decode the JWT to populate the user slice. */
function decodeUser(token: string) {
  try {
    const decoded = jwtDecode<CustomJwtPayload>(token);
    // Use explicit role field from JWT; fall back to isAdmin for legacy tokens
    const role = decoded.role || (decoded.isAdmin ? 'ADMIN' : 'STUDENT');
    return {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role, // 'ADMIN' | 'INSTRUCTOR' | 'STUDENT'
      isAdmin: !!decoded.isAdmin,
    };
  } catch {
    return {};
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequested: (state) => {
      state.isLoading = true;
    },

    loginRequestFailed: (state) => {
      state.isLoading = false;
    },

    loggedIn: (state, action) => {
      const token = extractToken(action.payload);
      state.isLoading = false;
      state.accessToken = token;
      state.refreshToken = extractRefreshToken(action.payload);
      state.user = decodeUser(token);
      state.notification = initialState.notification;
    },

    loggedOut: () => {
      return initialState;
    },

    signedUp: (state, action) => {
      state.isLoading = false;
      // API middleware unwraps to response.data; message is at payload.data.message
      const msg = action.payload?.data?.message || action.payload?.message || '';
      state.message = msg;
      state.isSignUp = true;
    },

    tokenRefreshed: (state, action) => {
      const token = extractToken(action.payload);
      state.isLoading = false;
      state.accessToken = token;
      state.refreshToken = extractRefreshToken(action.payload);
      state.user = decodeUser(token);
    },

    showNotification: (state, action) => {
      state.notification = {
        isOpen: true,
        message: action.payload.message,
        type: action.payload.type,
      };
    },

    closeNotification: (state) => {
      state.notification = initialState.notification;
    },
  },
});

export const {
  loggedIn,
  loggedOut,
  loginRequested,
  tokenRefreshed,
  loginRequestFailed,
  closeNotification,
  showNotification,
  signedUp,
} = authSlice.actions;

export default authSlice.reducer;

const url = '/auth';

// Action Creators
export const login = (data) =>
  apiCallBegan({
    url: `${url}/login`,
    method: 'post',
    data,
    onStart: loginRequested.type,
    onSuccess: loggedIn.type,
    onError: loginRequestFailed.type,
  });

export const signup = (data) =>
  apiCallBegan({
    url: `${url}/signup`,
    method: 'post',
    data,
    onStart: loginRequested.type,
    onSuccess: signedUp.type,
    onError: loginRequestFailed.type,
  });

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectDataStatus = (state) => state.auth.loading;
export const selectSignUpStatus = (state) => state.auth.isSignUp;
export const selectNotification = (state) => state.auth.notification;
export const selectPermissions = (state) => state.auth.permissions;
export const selectUserRole = (state) => state.auth.user?.role ?? 'STUDENT';
export const selectIsAdmin = (state) => state.auth.user?.role === 'ADMIN';
export const selectIsInstructor = (state) =>
  state.auth.user?.role === 'INSTRUCTOR' || state.auth.user?.role === 'ADMIN';
export const selectIsStudent = (state) => state.auth.user?.role === 'STUDENT';
