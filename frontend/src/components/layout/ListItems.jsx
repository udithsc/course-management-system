import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { List, ListItemText, ListItemIcon, ListItem, Collapse, Box } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import PropTypes from 'prop-types';
import SchoolIcon from '@mui/icons-material/School';
import { styled } from '@mui/material/styles';
import { lightBlue } from '@mui/material/colors';

const routes = ['/', '/users', '/courses', '/authors', '/categories'];

function ListItems({ open }) {
  const params = useLocation();
  const navigate = useNavigate();
  const routeIndex = routes.findIndex((route) => route === params.pathname);
  const [selectedIndex, setSelectedIndex] = useState(routeIndex);
  const [nestedMenuOpen, setNestedMenuOpen] = useState(true);

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
    navigate(routes[index]);
  };

  const handleNestedMenuClick = () => {
    setNestedMenuOpen(!nestedMenuOpen);
    handleListItemClick(2);
  };

  const MainListItem = styled(ListItem)(({ theme }) => ({
    '&.MuiListItem-root.Mui-selected': {
      backgroundColor: lightBlue[50],
      borderRight: theme.palette.primary.main,
      borderRightWidth: 4,
      borderRightStyle: 'solid'
    },
    '&.MuiListItem-root:hover': {
      backgroundColor: theme.palette.primary.light
    }
  }));

  const nestedPadding = open ? 4 : null;

  return (
    <Box sx={{ mt: 2 }}>
      <MainListItem selected={selectedIndex === 0} onClick={() => handleListItemClick(0)}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </MainListItem>
      <MainListItem selected={selectedIndex === 1} onClick={() => handleListItemClick(1)}>
        <ListItemIcon>
          <GroupIcon />
        </ListItemIcon>
        <ListItemText primary="Users" />
      </MainListItem>
      <MainListItem onClick={handleNestedMenuClick}>
        <ListItemIcon>
          <LocalLibraryIcon />
        </ListItemIcon>
        <ListItemText primary="Courses" />
        {nestedMenuOpen ? <ExpandLess /> : <ExpandMore />}
      </MainListItem>
      <Collapse in={nestedMenuOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <MainListItem
            sx={{ pl: nestedPadding }}
            selected={selectedIndex === 2}
            onClick={() => handleListItemClick(2)}
          >
            <ListItemIcon>
              <SchoolIcon />
            </ListItemIcon>
            <ListItemText primary="Courses" />
          </MainListItem>
          <MainListItem
            sx={{ pl: nestedPadding }}
            selected={selectedIndex === 3}
            onClick={() => handleListItemClick(3)}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Authors" />
          </MainListItem>
          <MainListItem
            sx={{ pl: nestedPadding }}
            selected={selectedIndex === 4}
            onClick={() => handleListItemClick(4)}
          >
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary="Categories" />
          </MainListItem>
        </List>
      </Collapse>
    </Box>
  );
}

ListItems.propTypes = {
  open: PropTypes.bool.isRequired
};

export default ListItems;
