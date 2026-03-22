import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from './api';

const slice = createSlice({
  name: 'subscriptions',
  initialState: {
    myCourses: [], // enrolled courses with progress
    loading: false,
    enrollLoading: false,
    notification: { isOpen: false, message: '', type: '' },
  },
  reducers: {
    // Loading
    subscriptionsRequested: (state) => {
      state.loading = true;
    },
    enrollRequested: (state) => {
      state.enrollLoading = true;
    },

    // My courses loaded
    subscriptionsReceived: (state, action) => {
      state.myCourses = action.payload;
      state.loading = false;
    },

    // Enrolled successfully
    enrollSucceeded: (state, action) => {
      state.enrollLoading = false;
      // Re-fetch will happen via loadMyCourses, but add optimistically if needed
      state.notification = { isOpen: true, message: 'Successfully enrolled!', type: 'success' };
    },

    // Progress updated
    progressUpdated: (state, action) => {
      const { courseId, lessonId } = action.payload;
      const course = state.myCourses.find((c) => c.id === courseId);
      if (course && !course.watchedVideoId.includes(lessonId)) {
        course.watchedVideoId = [...course.watchedVideoId, lessonId];
      }
    },

    // Error
    subscriptionsFailed: (state, action) => {
      state.loading = false;
      state.enrollLoading = false;
      state.notification = { isOpen: true, message: action.payload || 'Error', type: 'error' };
    },

    closeNotification: (state) => {
      state.notification = { isOpen: false, message: '', type: '' };
    },
  },
});

export const { closeNotification, progressUpdated } = slice.actions;
const {
  subscriptionsRequested,
  enrollRequested,
  subscriptionsReceived,
  enrollSucceeded,
  subscriptionsFailed,
} = slice.actions;

// Thunks
export const loadMyCourses = () =>
  apiCallBegan({
    url: '/courses/subscriptions/me',
    method: 'get',
    onStart: subscriptionsRequested.type,
    onSuccess: subscriptionsReceived.type,
    onError: subscriptionsFailed.type,
  });

export const enrollCourse = (courseId) =>
  apiCallBegan({
    url: `/courses/subscribe/${courseId}`,
    method: 'post',
    onStart: enrollRequested.type,
    onSuccess: enrollSucceeded.type,
    onError: subscriptionsFailed.type,
  });

export const markVideoWatched = (courseId, lessonId) =>
  apiCallBegan({
    url: `/courses/progress/${courseId}`,
    method: 'patch',
    data: { lessonId },
    onSuccess: progressUpdated.type,
    onError: subscriptionsFailed.type,
  });

// Selectors
export const selectMyCourses = (state) => state.subscriptions.myCourses;
export const selectEnrollLoading = (state) => state.subscriptions.enrollLoading;
export const selectSubsLoading = (state) => state.subscriptions.loading;
export const selectSubsNotification = (state) => state.subscriptions.notification;

export const selectIsEnrolled = (courseId) => (state) =>
  state.subscriptions.myCourses.some((c) => c.id === courseId);

export const selectCourseProgress = (courseId) => (state) => {
  const course = state.subscriptions.myCourses.find((c) => c.id === courseId);
  if (!course || !course.lessons?.length) return 0;
  return Math.round((course.watchedVideoId.length / course.lessons.length) * 100);
};

export default slice.reducer;
