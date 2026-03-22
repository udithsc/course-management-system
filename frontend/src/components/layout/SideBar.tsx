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
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: configData.DRAWER_WIDTH,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      border: 'none',
      background:
        theme.palette.mode === 'dark'
          ? 'linear-gradient(180deg, #161B27 0%, #1A2035 100%)'
          : 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
      borderRight:
        theme.palette.mode === 'dark'
          ? '1px solid rgba(255,255,255,0.05)'
          : '1px solid rgba(15,23,42,0.07)',
      boxShadow:
        theme.palette.mode === 'dark'
          ? '4px 0 24px rgba(0,0,0,0.4)'
          : '4px 0 24px rgba(15,23,42,0.05)',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(8),
        [theme.breakpoints.up('sm')]: { width: theme.spacing(9) },
      }),
    },
  }),
);

function SideBar({ open }) {
  const user = useSelector(selectUser);

  return (
    <Drawer variant="permanent" open={open}>
      {/* Logo Area */}
      <Box
        sx={{
          px: open ? 3 : 1.5,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          minHeight: 64,
          transition: 'all 0.3s',
        }}
      >
        <Box
          sx={{
            minWidth: 36,
            height: 36,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366F1 0%, #10B981 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 900,
            fontSize: '1rem',
            boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
            flexShrink: 0,
          }}
        >
          U
        </Box>
        {open && (
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={800}
              sx={{ lineHeight: 1.2, letterSpacing: '-0.3px', color: 'text.primary' }}
            >
              UDT Manager
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem' }}>
              Course Management
            </Typography>
          </Box>
        )}
      </Box>

      {/* Nav Menu */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', py: 2, px: open ? 1.5 : 1 }}>
        <ListItems open={open} />
      </Box>

      {/* User Profile Footer */}
      <Box
        sx={{
          p: open ? 2 : 1,
          borderTop: '1px solid',
          borderColor: 'divider',
          transition: 'all 0.3s',
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
              theme.palette.mode === 'dark' ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.06)',
            border: '1px solid',
            borderColor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.12)',
          }}
        >
          <Avatar
            sx={{
              width: 34,
              height: 34,
              bgcolor: 'primary.main',
              fontSize: '0.8rem',
              fontWeight: 700,
              flexShrink: 0,
              boxShadow: '0 0 0 2px rgba(99,102,241,0.3)',
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </Avatar>
          {open && (
            <Box sx={{ overflow: 'hidden' }}>
              <Typography
                variant="caption"
                fontWeight={700}
                noWrap
                sx={{ display: 'block', color: 'text.primary', lineHeight: 1.3 }}
              >
                {user?.name || 'Admin'}
              </Typography>
              <Chip
                label={user?.role || 'Administrator'}
                size="small"
                sx={{
                  height: 16,
                  fontSize: '0.58rem',
                  fontWeight: 700,
                  bgcolor: 'rgba(99,102,241,0.15)',
                  color: 'primary.light',
                  border: 'none',
                  '& .MuiChip-label': { px: 0.75 },
                }}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  );
}

SideBar.propTypes = { open: PropTypes.bool.isRequired };

export default SideBar;
