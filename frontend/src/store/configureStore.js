import { configureStore } from '@reduxjs/toolkit';
import reducer from './reducer';
import toast from './middleware/toast';
import api from './middleware/api';

export default function () {
  return configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware({
        serializableCheck: {
          // Ignore these action types
          ignoredActions: ['api/callBegan']
        }
      }),
      toast,
      api
    ]
  });
}
