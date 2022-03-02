import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import Controls from '../controls/Controls';

export default function Popup({ title, children, openPopup, setOpenPopup }) {
  return (
    <Dialog open={openPopup} maxWidth="md" scroll="paper">
      <DialogTitle>
        <div style={{ display: 'flex' }}>
          <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <Controls.ActionButton
            color="error.main"
            style={{ p: 0.5 }}
            onClick={() => setOpenPopup(false)}
          >
            <CloseIcon />
          </Controls.ActionButton>
        </div>
      </DialogTitle>
      <Divider />
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}

Popup.propTypes = {
  title: PropTypes.string.isRequired,
  openPopup: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired,
  setOpenPopup: PropTypes.func.isRequired
};
