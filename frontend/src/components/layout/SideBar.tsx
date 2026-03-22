import React from 'react';
import MuiDrawer from '@mui/material/Drawer';
import { Typography, Box, Avatar, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import ListItems from './ListItems';
import configData from '../../data.json';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/auth';

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: open ? configData.DRAWER_WIDTH : theme.spacing(9),
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    display: 'flex',
    '& .MuiDrawer-paper': {
      width: open ? configData.DRAWER_WIDTH : theme.spacing(9),
      height: '100vh',   // Fix height to 100% viewport
      position: 'fixed', // Anchor perfectly
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      border: 'none',
      overflowX: 'hidden',
      borderRight: theme.palette.mode === 'dark'
        ? '1px solid rgba(255,255,255,0.08)'
        : '1px solid rgba(15,23,42,0.06)',
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(180deg, #0B0F19 0%, #111827 100%)'
        : 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
      boxShadow: theme.palette.mode === 'dark'
        ? '4px 0 24px rgba(0,0,0,0.6)'
        : '4px 0 24px rgba(15,23,42,0.03)',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: open
          ? theme.transitions.duration.enteringScreen
          : theme.transitions.duration.leavingScreen,
      }),
    },
    // The following transition is applied to the spacer element so that Main Container slides properly:
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: open
        ? theme.transitions.duration.enteringScreen
        : theme.transitions.duration.leavingScreen,
    }),
  })
);

function SideBar({ open }) {
  const user = useSelector(selectUser);

  return (
    <Drawer variant="permanent" open={open}>
      {/* Brand Logo Header */}
      <Box
        sx={{
          px: open ? 3 : 2,
          py: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          minHeight: 76, // deeper header for modern look
          maxHeight: 76,
          transition: 'all 0.3s',
        }}
      >
        <Box
          sx={{
            minWidth: 42,
            height: 42,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #4F46E5 0%, #10B981 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 900,
            fontSize: '1.2rem',
            boxShadow: '0 8px 16px rgba(79, 70, 229, 0.35)',
            flexShrink: 0,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'scale(1.05) rotate(-5deg)' },
            cursor: 'pointer'
          }}
        >
          U
        </Box>
        {open && (
          <Box sx={{ animation: 'fadeIn 0.3s', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography
              variant="subtitle1"
              fontWeight={800}
              sx={{ lineHeight: 1.1, letterSpacing: '-0.5px', color: 'text.primary', fontSize: '1.15rem' }}
            >
              UDT Core
            </Typography>
            <Typography variant="caption" fontWeight={700} color="primary.main" sx={{ letterSpacing: '0.05em' }}>
              MANAGEMENT
            </Typography>
          </Box>
        )}
      </Box>

      {/* Primary Navigation */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          overflowY: 'auto', 
          overflowX: 'hidden', 
          py: 2.5, 
          px: open ? 1.5 : 1,
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-thumb': { borderRadius: '10px', backgroundColor: 'rgba(0,0,0,0.1)' }
        }}
      >
        <ListItems open={open} />
      </Box>

      {/* User Profile Footer */}
      <Box
        sx={{
          p: open ? 2 : 1.5,
          borderTop: '1px solid',
          borderColor: 'divider',
          transition: 'all 0.3s',
          background: (theme) => 
            theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: open ? 1.5 : 1,
            borderRadius: 3,
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.05)',
            border: '1px solid',
            borderColor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)',
            cursor: 'pointer',
            transition: 'all 0.2s',
            overflow: 'hidden',
            '&:hover': {
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={user?.avatar ? `${import.meta.env.VITE_API_URL}/files/${user.avatar}` : undefined}
              sx={{
                width: open ? 38 : 34,
                height: open ? 38 : 34,
                bgcolor: 'primary.main',
                fontSize: '0.9rem',
                fontWeight: 800,
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
                transition: 'all 0.3s'
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </Avatar>
            {!open && (
              <Box 
                sx={{ 
                  position: 'absolute', bottom: -2, right: -2, 
                  width: 10, height: 10, borderRadius: '50%', 
                  bgcolor: '#10B981', border: '2px solid white' 
                }} 
              />
            )}
          </Box>
          
          {open && (
            <Box sx={{ overflow: 'hidden', minWidth: 0, flex: 1 }}>
              <Typography
                variant="subtitle2"
                fontWeight={700}
                noWrap
                sx={{ display: 'block', color: 'text.primary', lineHeight: 1.2 }}
              >
                {user?.name || 'Administrator'}
              </Typography>
              <Typography
                variant="caption"
                fontWeight={600}
                sx={{ 
                  color: 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mt: 0.25
                }}
              >
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10B981', boxShadow: '0 0 4px #10B981' }} />
                Online
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  );
}

SideBar.propTypes = { open: PropTypes.bool.isRequired };

export default SideBar;
