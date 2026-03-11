import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { blue } from '@mui/material/colors';
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



  const MainListItem = styled(ListItem)(({ theme }) => ({
    '&.MuiListItem-root.Mui-selected': {
      color: theme.palette.primary.main,
      backgroundColor: `${theme.palette.primary.main}1A`, // 10% opacity
      fontWeight: 'bold',
    },
    '&.MuiListItem-root:hover': {
      backgroundColor: `${theme.palette.primary.main}0D`, // 5% opacity
      color: theme.palette.primary.main,
      '& .MuiListItemIcon-root': {
        color: theme.palette.primary.main,
      }
    },
    borderRadius: '12px',
    margin: '4px 12px',
    padding: '10px 16px',
    transition: 'all 0.2s ease-in-out',
    width: 'auto'
  }));

  const GenerateIcon = (variation, selected) => {
    const IconName = Muicon[variation];
    return <IconName sx={{ color: selected ? 'primary.main' : 'text.secondary', minWidth: 40, transition: 'color 0.2s' }} />;
  };

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
            <ListItemIcon sx={{ minWidth: 40 }}>{GenerateIcon(route.icon, route.subMenu.length === 0 && selectedRoute === route.path)}</ListItemIcon>
            <ListItemText primary={route.title} primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: (route.subMenu.length === 0 && selectedRoute === route.path) ? 600 : 500 }} />
            {route.subMenu.length > 0 && nestedMenuOpen && (
              <ExpandLess sx={{ color: 'text.secondary' }} />
            )}
            {route.subMenu.length > 0 && !nestedMenuOpen && (
              <ExpandMore sx={{ color: 'text.secondary' }} />
            )}
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
                    <ListItemIcon sx={{ minWidth: 40 }}>{GenerateIcon(subRoute.icon, selectedRoute === subRoute.path)}</ListItemIcon>
                    <ListItemText primary={subRoute.title} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: selectedRoute === subRoute.path ? 600 : 500 }} />
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
