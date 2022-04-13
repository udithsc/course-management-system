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
  totalElements: 0
};

const url = '/courses';

export const courseSlice = createSlice({
  name: 'course',
  initialState,

  reducers: {
    courseRequested: (state) => {
      state.loading = true;
    },

    courseReceived: (state, action) => {
      state.list = action.payload.data;
      state.loading = false;
      state.lastFetch = Date.now();
      state.notification = initialState.notification;
      state.totalElements = action.payload.totalElements;
    },

    courseReceiveFailed: (state) => {
      state.loading = false;
    },

    courseAdded: (state, action) => {
      state.notification = {
        isOpen: true,
        message: 'Course Added',
        type: 'info'
      };
    },

    courseUpdated: (state, action) => {
      state.notification = {
        isOpen: true,
        message: 'Course Updated',
        type: 'info'
      };
    },

    courseDeleted: (state, action) => {
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
  courseRequested,
  courseReceived,
  courseReceiveFailed,
  courseAdded,
  courseUpdated,
  courseDeleted,
  closeNotification
} = courseSlice.actions;

export default courseSlice.reducer;

// Selectors
export const selectCourses = (state) => state.courses.list;
export const selectDataStatus = (state) => state.courses.loading;
export const selectNotification = (state) => state.courses.notification;
export const selectTotalElements = (state) => state.courses.totalElements;

export const loadCourses =
  (page, rowsPerPage, searchText = '') =>
  (dispatch, getState) => {
    const { lastFetch } = getState().courses;
    const diffInSeconds = moment().diff(moment(lastFetch), 'seconds');
    // if (diffInSeconds < 120) return; // move values to config file

    return dispatch(
      apiCallBegan({
        url: page >= 0 ? `${url}?name=${searchText}&pageNo=${page}&pageSize=${rowsPerPage}` : url,
        onStart: courseRequested.type,
        onSuccess: courseReceived.type,
        onError: courseReceiveFailed.type
      })
    );
  };

export const addCourse = (data) =>
  apiCallBegan({
    url,
    method: 'post',
    data,
    onSuccess: courseAdded.type,
    onSuccessOther: loadCourses
  });

export const updateCourse = (data) =>
  apiCallBegan({
    url: `${url}/${data.get('id')}`,
    method: 'put',
    data,
    onSuccess: courseUpdated.type,
    onSuccessOther: loadCourses
  });

export const deleteCourse = (id) =>
  apiCallBegan({
    url: `${url}/${id}`,
    method: 'delete',
    data: id,
    onSuccess: courseDeleted.type,
    onSuccessOther: loadCourses
  });

export const createAddon = (data) =>
  apiCallBegan({
    url: `${url}/addons/${data.get('id')}`,
    method: 'patch',
    data,
    onSuccess: courseUpdated.type,
    onSuccessOther: loadCourses
  });

export const removeAddon = (courseId, addonId) =>
  apiCallBegan({
    url: `${url}/addons/${courseId}/${addonId}`,
    method: 'delete',
    onSuccess: courseUpdated.type,
    onSuccessOther: loadCourses
  });

export const uploadVideo = (data) =>
  apiCallBegan({
    url: `${url}/video/${data.get('id')}`,
    method: 'patch',
    data,
    onSuccess: courseUpdated.type,
    onSuccessOther: loadCourses
  });

export const removeVideo = (courseId, videoNo) =>
  apiCallBegan({
    url: `${url}/video/${courseId}/${videoNo}`,
    method: 'delete',
    onSuccess: courseUpdated.type,
    onSuccessOther: loadCourses
  });
