import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import { Typography, IconButton, Menu, MenuItem, Toolbar, Button, Box } from '@mui/material';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import PropTypes from 'prop-types';
import configData from '../../data.json';
import axios from 'axios';
import { selectUser, loggedOut } from '../../store/auth';

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: 'transparent',
  boxShadow: 'none',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: configData.DRAWER_WIDTH,
    width: `calc(100% - ${configData.DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

function Header({ open, toggleDrawer }) {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    delete axios.defaults.headers.common['x-auth-token'];
    dispatch(loggedOut());
    navigate('/login');
  };

  const handleAccountClick = () => {
    handleCloseUserMenu();
    navigate('/dashboard/account');
  };

  return (
    <AppBar 
      position="absolute" 
      open={open} 
      elevation={0}
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 4 } }}>
        <IconButton
          edge="start"
          color="inherit"
          onClick={toggleDrawer}
          sx={{
            marginRight: '20px',
            bgcolor: 'rgba(0,0,0,0.03)',
            borderRadius: 2,
            '&:hover': { bgcolor: 'rgba(0,0,0,0.06)' }
          }}
        >
          {open ? <MenuOpenIcon /> : <MenuIcon />}
        </IconButton>
        
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Typography 
            component="h1" 
            variant="h6" 
            fontWeight={700}
            sx={{ 
              opacity: open ? 0 : 1, 
              transition: 'opacity 0.3s',
              background: 'linear-gradient(45deg, #4F46E5 30%, #3B82F6 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {configData.APP_NAME}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ lineHeight: 1 }}>
              {user.name || 'Admin User'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
              {user.role || 'Super Admin'}
            </Typography>
          </Box>
          
          <Tooltip title="Account settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0.5, border: '2px solid transparent', '&:hover': { borderColor: 'primary.light' } }}>
              <Avatar 
                sx={{ 
                  bgcolor: 'primary.main', 
                  width: 40, 
                  height: 40,
                  fontSize: '1rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)'
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        <Menu
          sx={{ mt: '45px' }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
          PaperProps={{
            elevation: 0,
            sx: {
              borderRadius: 3,
              mt: 1.5,
              minWidth: 180,
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
              '& .MuiMenuItem-root': {
                px: 2,
                py: 1,
                borderRadius: 1.5,
                mx: 1,
                my: 0.5,
                fontSize: '0.875rem',
                fontWeight: 500,
              }
            }
          }}
        >
          <MenuItem onClick={handleAccountClick}>Account Settings</MenuItem>
          <Divider sx={{ my: '4px !important', mx: '16px !important' }} />
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired
};

export default Header;
