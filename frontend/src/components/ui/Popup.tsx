import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  IconButton,
  useTheme,
  Divider,
  Breakpoint,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

// Framer‑motion needs a plain DOM element—we forward it to the MUI Dialog Paper
const MotionPaper = motion(
  React.forwardRef((props: any, ref) => <Box ref={ref} {...props} />),
) as any;

export default function Popup({
  title,
  subtitle,
  icon,
  children,
  openPopup,
  setOpenPopup,
  maxWidth = 'sm',
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  openPopup: boolean;
  setOpenPopup: (open: boolean) => void;
  maxWidth?: Breakpoint | false;
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <AnimatePresence>
      {openPopup && (
        <Dialog
          open={openPopup}
          maxWidth={maxWidth}
          fullWidth
          scroll="paper"
          onClose={() => setOpenPopup(false)}
          PaperComponent={MotionPaper}
          PaperProps={{
            initial: { opacity: 0, scale: 0.92, y: 24 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.92, y: 24 },
            transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
            sx: {
              borderRadius: '12px',
              border: '1px solid',
              borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.08)',
              bgcolor: 'background.paper',
              backgroundImage: 'none',
              boxShadow: isDark
                ? '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)'
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
          {/* Header */}
          <DialogTitle sx={{ p: 0 }}>
            <Box
              sx={{
                px: 3.5,
                pt: 3.5,
                pb: 2.5,
                background: isDark
                  ? 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(16,185,129,0.06) 100%)'
                  : 'linear-gradient(135deg, rgba(99,102,241,0.07) 0%, rgba(16,185,129,0.04) 100%)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {icon && (
                  <Box
                    sx={{
                      p: 1.25,
                      borderRadius: 2.5,
                      flexShrink: 0,
                      background: 'linear-gradient(135deg, #6366F1 0%, #10B981 100%)',
                      color: 'white',
                      display: 'flex',
                      boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
                    }}
                  >
                    {icon}
                  </Box>
                )}
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={800}
                    sx={{ color: 'text.primary', lineHeight: 1.25 }}
                  >
                    {title}
                  </Typography>
                  {subtitle && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mt: 0.25 }}
                    >
                      {subtitle}
                    </Typography>
                  )}
                </Box>
              </Box>

              <IconButton
                onClick={() => setOpenPopup(false)}
                size="small"
                sx={{
                  flexShrink: 0,
                  color: 'text.secondary',
                  bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)',
                  border: '1px solid',
                  borderColor: 'divider',
                  width: 32,
                  height: 32,
                  '&:hover': {
                    bgcolor: 'rgba(244,63,94,0.12)',
                    color: 'error.main',
                    borderColor: 'rgba(244,63,94,0.3)',
                  },
                  transition: 'all 0.2s',
                }}
              >
                <CloseRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
            <Divider />
          </DialogTitle>

          {/* Body */}
          <DialogContent sx={{ p: { xs: 2.5, sm: 3.5 }, pt: '24px !important' }}>
            {children}
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

Popup.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.node,
  children: PropTypes.element.isRequired,
  openPopup: PropTypes.bool.isRequired,
  setOpenPopup: PropTypes.func.isRequired,
  maxWidth: PropTypes.string,
};

Popup.defaultProps = {
  subtitle: '',
  icon: null,
  maxWidth: 'sm',
};
