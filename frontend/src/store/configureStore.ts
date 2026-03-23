import { configureStore } from '@reduxjs/toolkit';
import reducer from './reducer';
import toast from './middleware/toast';
import api from './middleware/api';

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['api/callBegan'],
      },
    }).concat(toast, api),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default function () {
  return store;
}
