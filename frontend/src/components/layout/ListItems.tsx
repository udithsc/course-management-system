import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { List, ListItemText, ListItemIcon, ListItem, Collapse, Box, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import * as Muicon from '@mui/icons-material';
import configData from '../../data.json';

interface CustomListItemProps {
  open?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

const MainListItem = styled(ListItem, {
  shouldForwardProp: (p) => p !== 'open',
})<CustomListItemProps>(({ theme, open }) => ({
  '&.MuiListItem-root': {
    borderRadius: '12px',
    margin: open ? '6px 16px' : '8px 12px',
    padding: open ? '12px 16px' : '14px 0',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    justifyContent: open ? 'flex-start' : 'center',
    width: 'auto',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    color: theme.palette.mode === 'dark' ? '#D1D5DB' : '#475569',
  },
  '& .MuiListItemIcon-root': {
    minWidth: open ? 40 : 'auto',
    justifyContent: 'center',
    color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#64748B',
    transition: 'all 0.2s ease-in-out',
  },
  '&.MuiListItem-root.Mui-selected': {
    color: '#ffffff',
    background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
    boxShadow: '0 6px 16px rgba(79, 70, 229, 0.35)',
    '& .MuiListItemIcon-root': {
      color: '#ffffff',
      transform: open ? 'scale(1.1)' : 'scale(1.15)',
    },
    '&:hover': {
      background: 'linear-gradient(135deg, #4338CA 0%, #3730A3 100%)',
    },
  },
  '&.MuiListItem-root:hover:not(.Mui-selected)': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
    color: theme.palette.mode === 'dark' ? '#ffffff' : '#0F172A',
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
  },
}));

function ListItems({ open }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [nestedMenuOpen, setNestedMenuOpen] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState('/dashboard');

  useEffect(() => {
    setSelectedRoute(location.pathname);
  }, [location]);

  const GenerateIcon = (variation) => {
    const IconName = Muicon[variation];
    return <IconName fontSize="small" sx={{ color: 'inherit' }} />;
  };

  return (
    <Box sx={{ mt: 1 }}>
      {configData.ROUTES.map((route) => {
        const isParentSelected =
          route.subMenu.length === 0
            ? selectedRoute === route.path
            : route.subMenu.some((sub) => selectedRoute === sub.path);

        const itemContent = (
          <MainListItem
            open={open}
            selected={isParentSelected && route.subMenu.length === 0}
            onClick={() => {
              if (route.subMenu.length > 0) {
                setNestedMenuOpen(!nestedMenuOpen);
              } else {
                navigate(route.path);
              }
            }}
          >
            <ListItemIcon>{GenerateIcon(route.icon)}</ListItemIcon>

            {open && (
              <ListItemText
                primary={route.title}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: isParentSelected ? 700 : 600,
                  color: 'inherit',
                  whiteSpace: 'nowrap',
                }}
                sx={{ opacity: 1, transition: 'opacity 0.2s', m: 0 }}
              />
            )}

            {open && route.subMenu.length > 0 && (
              <Box sx={{ display: 'flex', color: 'inherit', opacity: 0.7 }}>
                {nestedMenuOpen ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
              </Box>
            )}
          </MainListItem>
        );

        return (
          <Box key={route.path}>
            {/* Tooltip wrapper for collapsed state */}
            {!open ? (
              <Tooltip title={route.title} placement="right" arrow>
                {itemContent}
              </Tooltip>
            ) : (
              itemContent
            )}

            {route.subMenu.length > 0 && (
              <Collapse in={nestedMenuOpen && open} timeout="auto" unmountOnExit>
                <List
                  component="div"
                  disablePadding
                  sx={{
                    position: 'relative',
                    mt: 1,
                    mb: 2,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: '34px',
                      top: 0,
                      bottom: '16px',
                      width: '2px',
                      borderRadius: '2px',
                      backgroundColor: 'divider',
                      display: 'block',
                    },
                  }}
                >
                  {route.subMenu.map((subRoute) => {
                    const isSubSelected = selectedRoute === subRoute.path;
                    return (
                      <ListItem
                        key={subRoute.path}
                        onClick={() => navigate(subRoute.path)}
                        sx={{
                          pl: 6,
                          pr: 2,
                          py: 1,
                          margin: '2px 16px',
                          borderRadius: '8px',
                          width: 'auto',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          color: isSubSelected
                            ? 'primary.main'
                            : (theme) => (theme.palette.mode === 'dark' ? '#9CA3AF' : '#64748B'),
                          background: isSubSelected
                            ? (theme) =>
                                theme.palette.mode === 'dark'
                                  ? 'rgba(99,102,241,0.1)'
                                  : 'rgba(99,102,241,0.06)'
                            : 'transparent',
                          '&:hover': {
                            color: 'primary.main',
                            background: (theme) =>
                              theme.palette.mode === 'dark'
                                ? 'rgba(255,255,255,0.04)'
                                : 'rgba(0,0,0,0.02)',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            mr: 2,
                            bgcolor: isSubSelected ? 'primary.main' : 'divider',
                            transition: 'all 0.2s',
                            boxShadow: isSubSelected ? '0 0 6px rgba(79, 70, 229, 0.4)' : 'none',
                          }}
                        />
                        <ListItemText
                          primary={subRoute.title}
                          primaryTypographyProps={{
                            fontSize: '0.85rem',
                            fontWeight: isSubSelected ? 700 : 500,
                            color: 'inherit',
                          }}
                        />
                      </ListItem>
                    );
                  })}
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
