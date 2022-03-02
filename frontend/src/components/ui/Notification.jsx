import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

export default function Notification({ notify, closeNotification }) {
  const dispatch = useDispatch();
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    dispatch(closeNotification());
  };

  return (
    <Snackbar
      sx={{ mt: 9 }}
      open={notify.isOpen}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      onClose={handleClose}
    >
      <Alert severity={notify.type} onClose={handleClose}>
        {notify.message}
      </Alert>
    </Snackbar>
  );
}

Notification.propTypes = {
  notify: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired
  }).isRequired,
  closeNotification: PropTypes.func.isRequired
};
