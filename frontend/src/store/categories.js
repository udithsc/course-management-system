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
  refresh: false
};

const url = '/categories';

export const categorySlice = createSlice({
  name: 'category',
  initialState,

  reducers: {
    categoryRequested: (state) => {
      state.loading = true;
    },

    categoryReceived: (state, action) => {
      state.list = action.payload.data;
      state.loading = false;
      state.refresh = false;
      state.lastFetch = Date.now();
      state.notification = initialState.notification;
      state.totalElements = action.payload.totalElements;
    },

    categoryReceiveFailed: (state) => {
      state.loading = false;
    },

    categoryAdded: (state, action) => {
      state.refresh = true;
      state.notification = {
        isOpen: true,
        message: 'Category Added',
        type: 'info'
      };
    },

    categoryUpdated: (state, action) => {
      state.refresh = true;
      state.notification = {
        isOpen: true,
        message: 'Category Updated',
        type: 'info'
      };
    },

    categoryDeleted: (state, action) => {
      state.refresh = true;
      state.notification = {
        isOpen: true,
        message: 'Factor Deleted ',
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
  categoryRequested,
  categoryReceived,
  categoryReceiveFailed,
  categoryAdded,
  categoryUpdated,
  categoryDeleted,
  closeNotification
} = categorySlice.actions;

export default categorySlice.reducer;

// Selectors
export const selectCategories = (state) => state.categories.list;
export const selectCategoryNames = (state) =>
  state.categories.list.map((a) => ({ id: a._id, title: a.name }));
export const selectDataStatus = (state) => state.categories.loading;
export const selectRefreshStatus = (state) => state.categories.refresh;
export const selectNotification = (state) => state.categories.notification;
export const selectTotalElements = (state) => state.categories.totalElements;

export const loadCategories =
  (page, rowsPerPage, searchText = '') =>
  (dispatch, getState) => {
    const { lastFetch } = getState().categories;
    const diffInSeconds = moment().diff(moment(lastFetch), 'seconds');
    // if (diffInSeconds < 120) return; // move values to config file

    return dispatch(
      apiCallBegan({
        url: page >= 0 ? `${url}?name=${searchText}&pageNo=${page}&pageSize=${rowsPerPage}` : url,
        onStart: categoryRequested.type,
        onSuccess: categoryReceived.type,
        onError: categoryReceiveFailed.type
      })
    );
  };

export const addCategory = (data) =>
  apiCallBegan({
    url,
    method: 'post',
    data,
    onSuccess: categoryAdded.type,
    onSuccessOther: loadCategories
  });

export const updateCategory = (data) =>
  apiCallBegan({
    url: `${url}/${data.get('id')}`,
    method: 'put',
    data,
    onSuccess: categoryUpdated.type,
    onSuccessOther: loadCategories
  });

export const deleteCategory = (id) =>
  apiCallBegan({
    url: `${url}/${id}`,
    method: 'delete',
    data: id,
    onSuccess: categoryDeleted.type,
    onSuccessOther: loadCategories
  });
