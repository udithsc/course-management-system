import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth';
import courseReducer from './courses';
import categoryReducer from './categories';
import authorReducer from './authors';
import userReducer from './users';

export default combineReducers({
  auth: authReducer,
  courses: courseReducer,
  categories: categoryReducer,
  authors: authorReducer,
  users: userReducer
});
