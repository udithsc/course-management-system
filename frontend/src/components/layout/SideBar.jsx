import React from 'react';
import MuiDrawer from '@mui/material/Drawer';
import { Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import PropTypes from 'prop-types';
import ListItems from './ListItems';
import configData from '../../data.json';

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: configData.DRAWER_WIDTH,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      }),
      boxSizing: 'border-box',
      borderRight: '1px solid',
      borderRightColor: 'rgba(0, 0, 0, 0.08)',
      backgroundColor: theme.palette.background.paper, 
      boxShadow: open ? '4px 0 24px rgba(0,0,0,0.02)' : 'none',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9)
        }
      })
    }
  })
);

function SideBar({ open }) {
  return (
    <Drawer variant="permanent" open={open}>
      <Toolbar
        sx={{
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'flex-start' : 'center',
          px: open ? 3 : 1,
          mb: 1,
        }}
      >
        {open ? (
          <Typography 
            variant="h6" 
            sx={{ 
              ml: 1.5, 
              fontWeight: 800,
              flexShrink: 0,
              fontSize: '1rem',
              letterSpacing: '-0.5px',
              background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            UDT Course Manager
          </Typography>
        ) : (
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 800,
              background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            UDT
          </Typography>
        )}
      </Toolbar>
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <ListItems open={open} />
      </Box>
      <Box sx={{ p: open ? 2 : 1, textAlign: 'center', transition: 'all 0.3s', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          {open ? 'v1.0.0' : 'v1'}
        </Typography>
      </Box>
    </Drawer>
  );
}

SideBar.propTypes = {
  open: PropTypes.bool.isRequired
};

export default SideBar;
