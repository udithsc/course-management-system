import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import { Typography, IconButton, Menu, MenuItem, Toolbar, Button, Box } from '@mui/material';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import PropTypes from 'prop-types';
import configData from '../../data.json';
import { selectUser } from '../../store/auth';

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
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
  const user = useSelector(selectUser);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <AppBar position="absolute" open={open}>
      <Toolbar
        sx={{
          pr: '24px', // keep right padding when drawer closed
          '&.MuiToolbar-root': {
            color: 'white'
          }
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          sx={{
            marginRight: '30px'
          }}
        >
          {open ? <MenuOpenIcon /> : <MenuIcon />}
        </IconButton>
        <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          {configData.APP_NAME}
        </Typography>
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, mr: 1 }}>
              <Avatar sx={{ bgcolor: 'white', color: 'green' }} aria-label="recipe">
                {/* {user.name.charAt(0).toUpperCase()} */}U
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem>
              <Typography textAlign="center">Account</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Typography textAlign="center">Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
        <Box>
          <Typography variant="subtitle2" gutterBottom component="div" sx={{ mb: -0.5 }}>
            {user.name}
          </Typography>
          <Typography variant="body2" gutterBottom>
            {user.role}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired
};

export default Header;
