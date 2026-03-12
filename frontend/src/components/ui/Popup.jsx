import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Divider, Box, Slide, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Popup({ title, children, openPopup, setOpenPopup }) {
  return (
    <Dialog 
      open={openPopup} 
      maxWidth="md" 
      fullWidth
      scroll="paper"
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }
      }}
    >
      <DialogTitle sx={{ p: 2.5, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={700}>
            {title}
          </Typography>
          <IconButton
            onClick={() => setOpenPopup(false)}
            sx={{ 
              bgcolor: 'error.main', 
              color: 'white',
              opacity: 0.1,
              transition: 'all 0.2s',
              '&:hover': { bgcolor: 'error.dark', opacity: 1 },
              width: 32,
              height: 32
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider sx={{ mx: 2.5 }} />
      <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
        {children}
      </DialogContent>
    </Dialog>
  );
}

Popup.propTypes = {
  title: PropTypes.string.isRequired,
  openPopup: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired,
  setOpenPopup: PropTypes.func.isRequired
};
