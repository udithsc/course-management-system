import { createSlice, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { apiCallBegan } from '../api';

export interface EntityState<T> {
  list: T[];
  loading: boolean;
  lastFetch: number | null;
  notification: {
    isOpen: boolean;
    message: string;
    type: string;
  };
  totalElements: number;
  refresh: boolean;
}

export const createInitialState = <T>(): EntityState<T> => ({
  list: [],
  loading: false,
  lastFetch: null,
  notification: {
    isOpen: false,
    message: '',
    type: '',
  },
  totalElements: 0,
  refresh: false,
});

interface GenericSliceOptions<T> {
  name: string;
  url: string;
}

export const createEntitySlice = <T extends { id?: string | number }>(
  options: GenericSliceOptions<T>,
) => {
  const initialState = createInitialState<T>();

  const slice = createSlice({
    name: options.name,
    initialState,
    reducers: {
      requested: (state) => {
        state.loading = true;
      },
      received: (state, action: PayloadAction<{ data: T[]; totalElements: number }>) => {
        state.list = action.payload.data as any;
        state.loading = false;
        state.refresh = false;
        state.lastFetch = Date.now();
        state.notification = initialState.notification;
        state.totalElements = action.payload.totalElements;
      },
      requestFailed: (state) => {
        state.loading = false;
      },
      added: (state, action) => {
        state.refresh = true;
        state.notification = {
          isOpen: true,
          message: `${options.name.charAt(0).toUpperCase() + options.name.slice(1)} Added`,
          type: 'info',
        };
      },
      updated: (state) => {
        state.refresh = true;
        state.notification = {
          isOpen: true,
          message: `${options.name.charAt(0).toUpperCase() + options.name.slice(1)} Updated`,
          type: 'info',
        };
      },
      deleted: (state) => {
        state.refresh = true;
        state.notification = {
          isOpen: true,
          message: 'Deleted Successfully',
          type: 'error',
        };
      },
      showNotification: (state, action: PayloadAction<{ message: string; type: string }>) => {
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

  const {
    requested,
    received,
    requestFailed,
    added,
    updated,
    deleted,
    showNotification,
    closeNotification,
  } = slice.actions;

  // Action Creators
  const loadEntities =
    (page?: number, rowsPerPage?: number, searchText = '') =>
    (dispatch: any, getState: any) => {
      // Logic for caching can be added here
      return dispatch(
        apiCallBegan({
          url:
            page !== undefined && page >= 0
              ? `${options.url}?name=${searchText}&pageNo=${page}&pageSize=${rowsPerPage}`
              : options.url,
          onStart: requested.type,
          onSuccess: received.type,
          onError: requestFailed.type,
        }),
      );
    };

  const addEntity = (data: any) =>
    apiCallBegan({
      url: options.url,
      method: 'post',
      data,
      onSuccess: added.type,
    });

  const updateEntity = (data: any, idSelector: (d: any) => string | number = (d) => d.id) =>
    apiCallBegan({
      url: `${options.url}/${idSelector(data)}`,
      method: 'put',
      data,
      onSuccess: updated.type,
    });

  const deleteEntity = (id: string | number) =>
    apiCallBegan({
      url: `${options.url}/${id}`,
      method: 'delete',
      data: id,
      onSuccess: deleted.type,
    });

  return {
    slice,
    actions: {
      ...slice.actions,
      loadEntities,
      addEntity,
      updateEntity,
      deleteEntity,
    },
  };
};
