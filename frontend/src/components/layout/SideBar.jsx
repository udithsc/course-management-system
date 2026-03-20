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
      borderRight: '1px solid rgba(0,0,0,0.05)',
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      backdropFilter: 'blur(10px)',
      boxShadow: open ? '4px 0 24px rgba(0,0,0,0.02)' : 'none',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(10)
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
          py: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'flex-start' : 'center',
          px: open ? 3 : 1,
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              background: 'linear-gradient(45deg, #4F46E5 30%, #10B981 90%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 900,
              fontSize: '1.2rem',
              boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)'
            }}
          >
            U
          </Box>
          {open && (
            <Typography 
              variant="h6" 
              sx={{ 
                ml: 1.5, 
                fontWeight: 800,
                fontSize: '1.1rem',
                letterSpacing: '-0.5px',
                color: 'text.primary',
              }}
            >
              UDT Manager
            </Typography>
          )}
        </Box>
      </Toolbar>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', px: open ? 2 : 1 }}>
        <ListItems open={open} />
      </Box>
      <Box sx={{ p: open ? 3 : 1, transition: 'all 0.3s' }}>
        <Box 
          sx={{ 
            p: open ? 2 : 0, 
            borderRadius: 3, 
            bgcolor: open ? 'rgba(79, 70, 229, 0.05)' : 'transparent',
            textAlign: 'center' 
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.7rem' }}>
            {open ? 'VERSION 1.0.0' : 'V1'}
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}

SideBar.propTypes = {
  open: PropTypes.bool.isRequired
};

export default SideBar;
