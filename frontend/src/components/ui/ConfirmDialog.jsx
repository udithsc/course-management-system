import React from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton
} from '@mui/material';
import PropTypes from 'prop-types';
import Controls from '../controls/Controls';

export default function ConfirmDialog({ confirmDialog, setConfirmDialog }) {
  return (
    <Dialog open={confirmDialog.isOpen}>
      <DialogTitle sx={{ textAlign: 'center' }}>
        <IconButton
          disableRipple
          sx={{
            color: 'error.main',
            '& .MuiSvgIcon-root': {
              fontSize: '6rem'
            }
          }}
        >
          <CancelIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center' }}>
        <Typography variant="h6">{confirmDialog.title}</Typography>
        <Typography variant="subtitle2">{confirmDialog.subTitle}</Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', mb: 2 }}>
        <Controls.Button
          variant="text"
          text="No"
          textColor="black"
          onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        />
        <Controls.Button text="Yes" color="error" onClick={confirmDialog.onConfirm} />
      </DialogActions>
    </Dialog>
  );
}

ConfirmDialog.propTypes = {
  confirmDialog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired
  }).isRequired,
  setConfirmDialog: PropTypes.func.isRequired
};
