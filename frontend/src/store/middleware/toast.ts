import { useErrorToast } from '../../hooks/useToast';

const toast = (store) => (next) => (action) => {
  const toast = useErrorToast();

  if (action.type === 'api/callFailed') toast(action.payload);
  else return next(action);
};

export default toast;
