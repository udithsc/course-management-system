import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import moment from 'moment';
import { apiCallBegan } from './api';

const initialState = {
  list: [],
  loading: false,
  lastFetch: null,
  notification: {
    isOpen: false,
    message: '',
    type: ''
  },
  totalElements: 0,
  refresh: false
};

const url = '/users';

export const userSlice = createSlice({
  name: 'user',
  initialState,

  reducers: {
    usersRequested: (state) => {
      state.loading = true;
    },

    usersReceived: (state, action) => {
      state.list = action.payload.data;
      state.loading = false;
      state.refresh = false;
      state.lastFetch = Date.now();
      state.notification = initialState.notification;
      state.totalElements = action.payload.totalElements;
    },

    usersReceiveFailed: (state) => {
      state.loading = false;
    },

    userAdded: (state, action) => {
      state.refresh = true;
      state.notification = {
        isOpen: true,
        message: 'User Added',
        type: 'success'
      };
    },

    userUpdated: (state, action) => {
      state.refresh = true;
      state.notification = {
        isOpen: true,
        message: 'User Updated',
        type: 'success'
      };
    },

    userDeleted: (state, action) => {
      state.refresh = true;
      state.notification = {
        isOpen: true,
        message: 'User Deleted ',
        type: 'error'
      };
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
  usersRequested,
  usersReceived,
  usersRequestFailed,
  userAdded,
  userUpdated,
  userDeleted,
  closeNotification
} = userSlice.actions;

export default userSlice.reducer;

export const selectUsers = (state) => state.users.list;
export const selectDataStatus = (state) => state.users.loading;
export const selectRefreshStatus = (state) => state.users.refresh;
export const selectNotification = (state) => state.users.notification;
export const selectTotalElements = (state) => state.users.totalElements;

// Action Creators
export const loadUsers =
  (page, rowsPerPage, searchText = '') =>
  (dispatch, getState) => {
    const { lastFetch } = getState().users;
    const diffInSeconds = moment().diff(moment(lastFetch), 'seconds');
    // if (diffInSeconds < 120) return; // move values to config file

    return dispatch(
      apiCallBegan({
        url: page >= 0 ? `${url}?name=${searchText}&pageNo=${page}&pageSize=${rowsPerPage}` : url,
        onStart: usersRequested.type,
        onSuccess: usersReceived.type
        // onError: usersRequestFailed.type
      })
    );
  };

export const addUser = (data) =>
  apiCallBegan({
    url,
    method: 'post',
    data,
    onSuccess: userAdded.type,
    onSuccessOther: loadUsers
  });

export const updateUser = (data) =>
  apiCallBegan({
    url: `${url}/${data._id}`,
    method: 'put',
    data,
    onSuccess: userUpdated.type,
    onSuccessOther: loadUsers
  });

export const deleteUser = (id) =>
  apiCallBegan({
    url: `${url}/${id}`,
    method: 'delete',
    data: id,
    onSuccess: userDeleted.type,
    onSuccessOther: loadUsers
  });
