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
  const [selectedRoute, setSelectedRoute] = useState('/dashboard');

  useEffect(() => {
    setSelectedRoute(location.pathname);
  }, [location]);

  const MainListItem = styled(ListItem)(({ theme }) => ({
    '&.MuiListItem-root': {
      borderRadius: '10px',
      margin: '4px 12px',
      padding: '10px 16px',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      width: 'auto',
      position: 'relative',
    },
    '&.MuiListItem-root.Mui-selected': {
      color: theme.palette.primary.main,
      backgroundColor: `${theme.palette.primary.main}1A`, // 10% opacity
    },
    '&.MuiListItem-root.Mui-selected::before': {
      content: '""',
      position: 'absolute',
      left: '-12px',
      top: '50%',
      transform: 'translateY(-50%)',
      height: '60%',
      width: '4px',
      backgroundColor: theme.palette.primary.main,
      borderRadius: '0 4px 4px 0',
      transition: 'opacity 0.3s ease',
    },
    '&.MuiListItem-root:hover': {
      backgroundColor: `${theme.palette.primary.main}0D`, // 5% opacity
      color: theme.palette.primary.main,
      '& .MuiListItemIcon-root': {
        color: theme.palette.primary.main,
        transform: 'scale(1.1)',
      },
    },
  }));

  const GenerateIcon = (variation, selected) => {
    const IconName = Muicon[variation];
    return (
      <IconName
        sx={{
          color: selected ? 'primary.main' : 'text.secondary',
          minWidth: 40,
          transition: 'all 0.2s ease-in-out',
        }}
      />
    );
  };

  return (
    <Box sx={{ mt: 1 }}>
      {configData.ROUTES.map((route) => {
        const isParentSelected =
          route.subMenu.length === 0
            ? selectedRoute === route.path
            : route.subMenu.some((sub) => selectedRoute === sub.path);

        return (
          <Box key={route.path}>
            <MainListItem
              selected={isParentSelected && route.subMenu.length === 0}
              onClick={() => {
                if (route.subMenu.length > 0) {
                  setNestedMenuOpen(!nestedMenuOpen);
                } else {
                  navigate(route.path);
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {GenerateIcon(route.icon, isParentSelected)}
              </ListItemIcon>
              <ListItemText
                primary={route.title}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: isParentSelected ? 600 : 500,
                  color: isParentSelected ? 'primary.main' : 'text.primary',
                }}
              />
              {route.subMenu.length > 0 && nestedMenuOpen && (
                <ExpandLess sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
              )}
              {route.subMenu.length > 0 && !nestedMenuOpen && (
                <ExpandMore sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
              )}
            </MainListItem>

            {route.subMenu.length > 0 && (
              <Collapse in={nestedMenuOpen} timeout="auto" unmountOnExit>
                <List
                  component="div"
                  disablePadding
                  sx={{
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: '28px',
                      top: 0,
                      bottom: '16px',
                      width: '1px',
                      backgroundColor: 'rgba(0,0,0,0.08)',
                      display: open ? 'block' : 'none',
                    },
                  }}
                >
                  {route.subMenu.map((subRoute) => (
                    <MainListItem
                      key={subRoute.path}
                      sx={{
                        pl: open ? 5 : null,
                        margin: '2px 12px',
                      }}
                      selected={selectedRoute === subRoute.path}
                      onClick={() => {
                        navigate(subRoute.path);
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {GenerateIcon(subRoute.icon, selectedRoute === subRoute.path)}
                      </ListItemIcon>
                      <ListItemText
                        primary={subRoute.title}
                        primaryTypographyProps={{
                          fontSize: '0.85rem',
                          fontWeight: selectedRoute === subRoute.path ? 600 : 500,
                          color:
                            selectedRoute === subRoute.path ? 'primary.main' : 'text.secondary',
                        }}
                      />
                    </MainListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

ListItems.propTypes = {
  open: PropTypes.bool.isRequired,
};

export default ListItems;
