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

const url = '/authors';

export const authorSlice = createSlice({
  name: 'author',
  initialState,

  reducers: {
    authorRequested: (state) => {
      state.loading = true;
    },

    authorReceived: (state, action) => {
      state.list = action.payload.data;
      state.loading = false;
      state.refresh = false;
      state.lastFetch = Date.now();
      state.notification = initialState.notification;
      state.totalElements = action.payload.totalElements;
    },

    authorReceiveFailed: (state) => {
      state.loading = false;
    },

    authorAdded: (state, action) => {
      state.refresh = true;
      state.notification = {
        isOpen: true,
        message: 'Author Added',
        type: 'info'
      };
    },

    authorUpdated: (state, action) => {
      state.refresh = true;
      state.notification = {
        isOpen: true,
        message: 'Author Updated',
        type: 'info'
      };
    },

    authorDeleted: (state, action) => {
      state.refresh = true;
      state.notification = {
        isOpen: true,
        message: 'Deleted Successfully',
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
  authorRequested,
  authorReceived,
  authorReceiveFailed,
  authorAdded,
  authorUpdated,
  authorDeleted,
  closeNotification
} = authorSlice.actions;

export default authorSlice.reducer;

// Selectors
export const selectAuthors = (state) => state.authors.list;
export const selectAuthorsNames = (state) =>
  state.authors.list.map((a) => ({ id: a._id, title: a.name }));
export const selectDataStatus = (state) => state.authors.loading;
export const selectRefreshStatus = (state) => state.authors.refresh;
export const selectNotification = (state) => state.authors.notification;
export const selectTotalElements = (state) => state.authors.totalElements;

export const loadAuthors =
  (page, rowsPerPage, searchText = '') =>
  (dispatch, getState) => {
    const { lastFetch } = getState().authors;
    const diffInSeconds = moment().diff(moment(lastFetch), 'seconds');
    // if (diffInSeconds < 120) return; // move values to config file

    return dispatch(
      apiCallBegan({
        url: page >= 0 ? `${url}?name=${searchText}&pageNo=${page}&pageSize=${rowsPerPage}` : url,
        onStart: authorRequested.type,
        onSuccess: authorReceived.type,
        onError: authorReceiveFailed.type
      })
    );
  };

export const addAuthor = (data) =>
  apiCallBegan({
    url,
    method: 'post',
    data,
    onSuccess: authorAdded.type
  });

export const updateAuthor = (data) =>
  apiCallBegan({
    url: `${url}/${data.get('id')}`,
    method: 'put',
    data,
    onSuccess: authorUpdated.type
  });

export const deleteAuthor = (id) =>
  apiCallBegan({
    url: `${url}/${id}`,
    method: 'delete',
    data: id,
    onSuccess: authorDeleted.type
  });
