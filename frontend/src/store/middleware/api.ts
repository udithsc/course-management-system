import axios from 'axios';
import * as actions from '../api';
import { loggedOut } from '../auth';
import { toast } from 'react-toastify';

const api =
  ({ dispatch }) =>
  (next) =>
  async (action) => {
    if (action.type !== actions.apiCallBegan.type) return next(action);

    const { url, method, data, onStart, onSuccess, onError, onSuccessOther } = action.payload;

    if (onStart) dispatch({ type: onStart });

    next(action);
    if (data && data.id === 0) delete data.id;
    try {
      const response = await axios.request({
        baseURL: `${import.meta.env.VITE_API_URL}/api`,
        url,
        method,
        data,
      });

      // General
      dispatch(actions.apiCallSuccess(response.data));

      // Specific
      if (onSuccess) dispatch({ type: onSuccess, payload: response.data, data });
      if (onSuccessOther) dispatch(onSuccessOther(data?.page, data?.rowsPerPage));
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data?.msg || error.response.data?.error || 'An error occurred'
        : error.message;

      // General
      dispatch(actions.apiCallFailed(errorMessage));

      // Don't show toast for 403 / unauthenticated since it logs out anyway, or don't double show
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        toast.error(errorMessage);
      }

      // Specific
      if (onError)
        dispatch({
          type: onError,
          payload: errorMessage,
        });

      if (error.response && error.response.status === 403) dispatch({ type: loggedOut.type });
    }
  };

export default api;
