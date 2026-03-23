import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import {
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Box,
  Divider,
  Tooltip,
  Avatar,
  Badge,
  Button,
} from '@mui/material';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PropTypes from 'prop-types';
import axios from 'axios';
import configData from '../../data.json';
import { selectUser, loggedOut } from '../../store/auth';
import { useColorMode } from '../../ColorModeProvider';

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar: React.FC<AppBarProps> = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundImage: 'none',
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(22, 27, 39, 0.85)' : 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  boxShadow: 'none',
  borderBottom: `1px solid ${
    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.07)'
  }`,
  color: theme.palette.text.primary,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: configData.DRAWER_WIDTH,
    width: `calc(100% - ${configData.DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

function Header({ open, toggleDrawer }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { mode, toggleColorMode } = useColorMode();

  const handleLogout = () => {
    sessionStorage.clear();
    delete axios.defaults.headers.common['x-auth-token'];
    dispatch(loggedOut());
    navigate('/login');
  };

  return (
    <AppBar position="fixed" open={open} elevation={0}>
      <Toolbar sx={{ px: { xs: 2, sm: 3 }, gap: 1, minHeight: '64px !important' }}>
        {/* Hamburger */}
        <Tooltip title={open ? 'Collapse sidebar' : 'Expand sidebar'}>
          <IconButton
            onClick={toggleDrawer}
            size="small"
            sx={{
              color: 'text.secondary',
              bgcolor: (t) =>
                t.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.05)',
              borderRadius: 2,
              mr: 1,
              '&:hover': {
                color: 'primary.main',
                bgcolor: (t) =>
                  t.palette.mode === 'dark' ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)',
              },
            }}
          >
            {open ? <MenuOpenIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
          </IconButton>
        </Tooltip>

        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{
              color: 'text.primary',
              background: 'linear-gradient(90deg, #6366F1, #10B981)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            {configData.APP_NAME}
          </Typography>
        </Box>

        {/* Quick nav — Explore + My Learning */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
          <Button
            size="small"
            startIcon={<ExploreOutlinedIcon fontSize="small" />}
            onClick={() => navigate('/explore')}
            sx={{
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.78rem',
              color: 'text.secondary',
              '&:hover': { bgcolor: 'rgba(99,102,241,0.08)', color: 'primary.main' },
            }}
          >
            Explore
          </Button>
          <Button
            size="small"
            startIcon={<PlayCircleOutlineIcon fontSize="small" />}
            onClick={() => navigate('/my-learning')}
            sx={{
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.78rem',
              color: 'text.secondary',
              '&:hover': { bgcolor: 'rgba(16,185,129,0.08)', color: 'success.main' },
            }}
          >
            My Learning
          </Button>
        </Box>

        {/* Right icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {/* Dark mode toggle */}
          <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
            <IconButton
              onClick={toggleColorMode}
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main', bgcolor: 'rgba(99,102,241,0.08)' },
                borderRadius: 2,
              }}
            >
              {mode === 'dark' ? (
                <LightModeOutlinedIcon fontSize="small" />
              ) : (
                <DarkModeOutlinedIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main', bgcolor: 'rgba(99,102,241,0.08)' },
                borderRadius: 2,
              }}
            >
              <Badge
                badgeContent={3}
                color="error"
                sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: 16, minWidth: 16 } }}
              >
                <NotificationsNoneIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Divider */}
          <Divider
            orientation="vertical"
            flexItem
            sx={{ mx: 0.5, height: 24, alignSelf: 'center' }}
          />

          {/* User avatar */}
          <Tooltip title="Account">
            <Box
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                cursor: 'pointer',
                pl: 0.5,
                pr: 1,
                py: 0.5,
                borderRadius: 2.5,
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: (t) =>
                    t.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.05)',
                },
              }}
            >
              <Avatar
                sx={{
                  width: 33,
                  height: 33,
                  background: 'linear-gradient(135deg, #6366F1, #10B981)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  boxShadow: '0 0 0 2px rgba(99,102,241,0.3)',
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </Avatar>
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  sx={{ display: 'block', lineHeight: 1.3, color: 'text.primary' }}
                >
                  {user?.name || 'Admin'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.67rem' }}>
                  {user?.role || 'Administrator'}
                </Typography>
              </Box>
            </Box>
          </Tooltip>
        </Box>

        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 0,
            sx: {
              mt: 1.5,
              minWidth: 200,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: (t) =>
                t.palette.mode === 'dark'
                  ? '0 20px 40px rgba(0,0,0,0.5)'
                  : '0 20px 40px rgba(15,23,42,0.12)',
              bgcolor: 'background.paper',
              overflow: 'visible',
              '& .MuiMenuItem-root': {
                px: 2,
                py: 1.25,
                borderRadius: 2,
                mx: 0.75,
                my: 0.25,
                fontSize: '0.875rem',
                fontWeight: 500,
                '&:hover': { bgcolor: 'rgba(99,102,241,0.08)', color: 'primary.main' },
              },
            },
          }}
        >
          <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
            <Typography
              variant="caption"
              fontWeight={700}
              color="text.secondary"
              sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.68rem' }}
            >
              Signed in as
            </Typography>
            <Typography variant="body2" fontWeight={700} color="text.primary" noWrap>
              {user?.email || user?.name || 'Admin'}
            </Typography>
          </Box>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              navigate('/dashboard/account');
            }}
          >
            <PersonOutlineIcon sx={{ fontSize: 17, mr: 1.5, color: 'text.secondary' }} />
            Account Settings
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
            }}
          >
            <SettingsOutlinedIcon sx={{ fontSize: 17, mr: 1.5, color: 'text.secondary' }} />
            Preferences
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem
            onClick={handleLogout}
            sx={{
              color: 'error.main !important',
              '&:hover': {
                bgcolor: 'rgba(244,63,94,0.08) !important',
                color: 'error.main !important',
              },
            }}
          >
            <LogoutOutlinedIcon sx={{ fontSize: 17, mr: 1.5 }} />
            Sign out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
};

export default Header;
