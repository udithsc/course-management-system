import React from 'react';
import MuiDrawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import PropTypes from 'prop-types';
import ListItems from './ListItems';
import logo from '../../resources/images/logo.png';
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
          pt: 0.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: [1]
        }}
      >
        <img src={logo} alt="Logo" width={50} />
      </Toolbar>
      <ListItems open={open} />
    </Drawer>
  );
}

ListItems.propTypes = {
  open: PropTypes.bool.isRequired
};

export default SideBar;
