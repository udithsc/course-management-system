import React from 'react';
import {
  Dialog, DialogContent, DialogActions,
  Typography, Box, Button, useTheme,
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

const MotionPaper = motion(
  React.forwardRef((props, ref) => <Box ref={ref} {...props} />)
);

export default function ConfirmDialog({ confirmDialog, setConfirmDialog }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleClose = () =>
    setConfirmDialog({ ...confirmDialog, isOpen: false });

  return (
    <AnimatePresence>
      {confirmDialog.isOpen && (
        <Dialog
          open={confirmDialog.isOpen}
          onClose={handleClose}
          maxWidth="xs"
          fullWidth
          PaperComponent={MotionPaper}
          PaperProps={{
            initial:    { opacity: 0, scale: 0.88, y: 16 },
            animate:    { opacity: 1, scale: 1,    y: 0 },
            exit:       { opacity: 0, scale: 0.88, y: 16 },
            transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
            sx: {
              borderRadius: '20px',
              border: '1px solid',
              borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.08)',
              bgcolor: 'background.paper',
              backgroundImage: 'none',
              boxShadow: isDark
                ? '0 32px 80px rgba(0,0,0,0.7)'
                : '0 32px 80px rgba(15,23,42,0.18)',
              overflow: 'hidden',
            },
          }}
          BackdropProps={{
            sx: {
              backdropFilter: 'blur(6px)',
              bgcolor: isDark ? 'rgba(0,0,0,0.65)' : 'rgba(15,23,42,0.35)',
            },
          }}
        >
          {/* Warning icon band */}
          <Box
            sx={{
              pt: 4, pb: 2, px: 3,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              background: isDark
                ? 'linear-gradient(180deg, rgba(244,63,94,0.12) 0%, transparent 100%)'
                : 'linear-gradient(180deg, rgba(244,63,94,0.07) 0%, transparent 100%)',
            }}
          >
            <Box
              sx={{
                width: 68, height: 68, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, rgba(244,63,94,0.15), rgba(244,63,94,0.08))',
                border: '2px solid rgba(244,63,94,0.25)',
                mb: 1,
              }}
            >
              <WarningAmberRoundedIcon sx={{ fontSize: 36, color: 'error.main' }} />
            </Box>
          </Box>

          <DialogContent sx={{ px: 4, pb: 2, pt: 0, textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={800} color="text.primary" sx={{ mb: 0.75 }}>
              {confirmDialog.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {confirmDialog.subTitle}
            </Typography>
          </DialogContent>

          <DialogActions sx={{ px: 4, pb: 3.5, pt: 2, gap: 1.5, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{
                flex: 1, borderRadius: 2.5, py: 1.1, fontWeight: 700,
                borderColor: 'divider',
                color: 'text.secondary',
                '&:hover': { borderColor: 'text.secondary', bgcolor: 'transparent' },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                confirmDialog.onConfirm();
                handleClose();
              }}
              sx={{
                flex: 1, borderRadius: 2.5, py: 1.1, fontWeight: 700,
                background: 'linear-gradient(135deg, #F43F5E, #E11D48)',
                boxShadow: '0 4px 14px rgba(244,63,94,0.4)',
                '&:hover': { boxShadow: '0 6px 20px rgba(244,63,94,0.5)' },
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

ConfirmDialog.propTypes = {
  confirmDialog: PropTypes.shape({
    isOpen:   PropTypes.bool.isRequired,
    title:    PropTypes.string.isRequired,
    subTitle: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
  }).isRequired,
  setConfirmDialog: PropTypes.func.isRequired,
};
