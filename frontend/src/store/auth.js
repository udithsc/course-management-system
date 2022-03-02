import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from './api';

const initialState = {
  isLoading: false,
  accessToken: '',
  refreshToken: '',
  expires_in: 0,
  user: {},
  isLoggedIn: false,
  isSignUp: false,
  notification: {
    isOpen: false,
    message: '',
    type: ''
  },
  refresh: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequested: (state, action) => {
      state.isLoading = true;
    },

    loginRequestFailed: (state, action) => {
      state.isLoading = false;
      state.message = '';
    },

    loggedIn: (state, action) => {
      state.isLoading = false;
      state.isLoggedIn = true;
      state.refresh = false;
      state.accessToken = action.payload.accessToken;
      // state.refreshToken = action.payload.refreshToken;
      state.notification = initialState.notification;
    },

    loggedOut: (state, action) => {
      state = initialState;
    },

    signedUp: (state, action) => {
      state.isLoading = false;
      state.message = action.payload.data;
      state.isSignUp = true;
    },

    tokenRefreshed: (state, action) => {
      state.isLoading = false;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },

    showNotification: (state, action) => {
      state.notification = {
        isOpen: true,
        message: action.payload.message,
        type: action.payload.type
      };
    },

    closeNotification: (state, action) => {
      state.notification = initialState.notification;
    }
  }
});

export const {
  loggedIn,
  loggedOut,
  loginRequested,
  tokenRefreshed,
  loginRequestFailed,
  closeNotification,
  showNotification,
  signedUp
} = authSlice.actions;

export default authSlice.reducer;

const url = '/auth';

// Action Creators
export const login = (data) =>
  apiCallBegan({
    url: `${url}/login`,
    method: 'post',
    data,
    onSuccess: loggedIn.type,
    onError: loginRequestFailed.type
  });

export const signup = (data) =>
  apiCallBegan({
    url: `${url}/signup`,
    method: 'post',
    data,
    onSuccess: signedUp.type,
    onError: loginRequestFailed.type
  });

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectDataStatus = (state) => state.auth.loading;
export const selectSignUpStatus = (state) => state.auth.isSignUp;
export const selectNotification = (state) => state.auth.notification;
export const selectLoginStatus = (state) => state.auth.isLoggedIn;
