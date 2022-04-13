import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { List, ListItemText, ListItemIcon, ListItem, Collapse, Box } from '@mui/material';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import * as Muicon from '@mui/icons-material';
import configData from '../../data.json';

function ListItems({ open }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [nestedMenuOpen, setNestedMenuOpen] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState('/');

  useEffect(() => {
    setSelectedRoute(location.pathname);
  }, [location]);

  // const GenerateIcon = (variation, props = {}) => {
  //   const IconName = Muicon[variation];
  //   const icon = <IconName {...props} />;
  //   return icon;
  // };

  const MainListItem = styled(ListItem)(({ theme }) => ({
    '&.MuiListItem-root.Mui-selected': {
      backgroundColor: '#e8f5e9',
      borderRight: theme.palette.primary.main,
      borderRightWidth: 4,
      borderRightStyle: 'solid'
    },
    '&.MuiListItem-root:hover': {
      backgroundColor: '#e8f5e9'
    }
  }));

  return (
    <Box sx={{ mt: 2 }}>
      {configData.ROUTES.map((route) => (
        <Box key={route.path}>
          <MainListItem
            selected={route.subMenu.length === 0 && selectedRoute === route.path}
            onClick={() => {
              if (route.subMenu.length > 0) setNestedMenuOpen(!nestedMenuOpen);
              navigate(route.path);
            }}
          >
            {/* <ListItemIcon>{GenerateIcon(route.icon)}</ListItemIcon> */}
            <ListItemText primary={route.title} />
            {route.subMenu.length > 0 && nestedMenuOpen && <ExpandLess />}
            {route.subMenu.length > 0 && !nestedMenuOpen && <ExpandMore />}
          </MainListItem>
          {route.subMenu.length > 0 && (
            <Collapse in={nestedMenuOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {route.subMenu.map((subRoute) => (
                  <MainListItem
                    key={subRoute.path}
                    sx={{ pl: open ? 4 : null }}
                    selected={selectedRoute === subRoute.path}
                    onClick={() => {
                      navigate(subRoute.path);
                    }}
                  >
                    {/* <ListItemIcon>{GenerateIcon(subRoute.icon)}</ListItemIcon> */}
                    <ListItemText primary={subRoute.title} />
                  </MainListItem>
                ))}
              </List>
            </Collapse>
          )}
        </Box>
      ))}
    </Box>
  );
}

ListItems.propTypes = {
  open: PropTypes.bool.isRequired
};

export default ListItems;
