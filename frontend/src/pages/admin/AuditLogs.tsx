import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  useTheme,
  IconButton,
  Tooltip,
  LinearProgress,
  Menu,
  MenuItem,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import HistoryIcon from '@mui/icons-material/History';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

const ActionColorMap = {
  SYSTEM_START: 'primary',
  COURSE_PUBLISH: 'success',
  LOGIN: 'info',
  FAILED_LOGIN: 'error',
  ROLE_UPDATE: 'warning',
  COURSE_ENROLL: 'secondary',
  BACKUP_CREATE: 'secondary',
  SYSTEM_EVENT: 'default',
};

const MotionPaper = motion(Paper);

export default function AuditLogs() {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [logTypeFilter, setLogTypeFilter] = useState('ALL');

  // Read actual logs from database backend
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/audit-logs`, {
          headers: { 'x-auth-token': sessionStorage.getItem('access-token') },
        });

        // Map Prisma DB SystemLogs structure to the DataGrid structure securely
        const mappedLogs = data.data.map((log) => {
          let actionStr = 'SYSTEM_EVENT';
          const msg = log.message.toLowerCase();

          if (msg.includes('login') || msg.includes('auth')) {
            actionStr = log.level === 'error' ? 'FAILED_LOGIN' : 'LOGIN';
          } else if (msg.includes('course') || msg.includes('publish')) {
            actionStr = log.level === 'error' ? 'SYSTEM_EVENT' : 'COURSE_PUBLISH';
          } else if (msg.includes('role') || msg.includes('user')) {
            actionStr = 'ROLE_UPDATE';
          } else if (msg.includes('start') || msg.includes('listen')) {
            actionStr = 'SYSTEM_START';
          }

          return {
            id: log.id,
            user: 'System Activity',
            role: 'CORE',
            action: actionStr,
            resource: log.message,
            status: log.level === 'error' ? 'FAILURE' : 'SUCCESS',
            ip: '-',
            timestamp: log.timestamp,
          };
        });

        setLogs(mappedLogs);
      } catch (err) {
        toast.error('Failed to load DB audit logs.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = Object.values(log).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase()),
    );
    const matchesType = logTypeFilter === 'ALL' || log.action === logTypeFilter;
    return matchesSearch && matchesType;
  });

  const columns = [
    {
      field: 'user',
      headerName: 'Actor',
      flex: 1.5,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: theme.palette.primary.main + '22',
              color: theme.palette.primary.main,
              fontSize: '0.8rem',
              fontWeight: 800,
            }}
          >
            {params.value.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={700}>
              {params.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.role}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'action',
      headerName: 'Event',
      flex: 1.5,
      minWidth: 150,
      renderCell: (params) => {
        const colorType = ActionColorMap[params.value] || 'default';
        return (
          <Chip
            label={params.value.replace('_', ' ')}
            size="small"
            color={colorType}
            sx={{ fontWeight: 700, fontSize: '0.7rem', height: 24, borderRadius: 1.5 }}
          />
        );
      },
    },
    {
      field: 'resource',
      headerName: 'Target Resource',
      flex: 2,
      minWidth: 300,
      renderCell: (params) => (
        <Typography
          variant="body2"
          fontWeight={600}
          color="text.secondary"
          noWrap
          title={params.value}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            fontWeight: 800,
            fontSize: '0.65rem',
            height: 20,
            bgcolor: params.value === 'SUCCESS' ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
            color: params.value === 'SUCCESS' ? '#10B981' : '#F43F5E',
            border: 'none',
          }}
        />
      ),
    },
    {
      field: 'timestamp',
      headerName: 'Time',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => {
        const date = new Date(params.value);
        return (
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {date.toLocaleDateString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {date.toLocaleTimeString()}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ pb: 6, maxWidth: 1440, mx: 'auto', width: '100%' }}>
      {/* Header Banner */}
      <MotionPaper
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          borderRadius: 4,
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)'
              : 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
          color: theme.palette.mode === 'dark' ? 'white' : '#312E81',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative', zIndex: 1 }}
        >
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'white',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
              display: 'flex',
            }}
          >
            <HistoryIcon
              fontSize="large"
              sx={{ color: theme.palette.mode === 'dark' ? '#818CF8' : '#4F46E5' }}
            />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.5px', mb: 0.5 }}>
              Security & Audit Logs
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 600 }}>
              Immutable record of system events, authentication attempts, and administrative actions
              seamlessly synced from the secure Database.
            </Typography>
          </Box>
        </Box>
      </MotionPaper>

      {/* Main DataGrid Section */}
      <MotionPaper
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            borderColor: 'divider',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <TextField
            placeholder="Search database events..."
            size="small"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ maxWidth: 400, width: '100%', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Filter logs">
              <IconButton
                onClick={(e) => setFilterAnchorEl(e.currentTarget)}
                sx={{
                  border: '1px solid',
                  borderColor: logTypeFilter !== 'ALL' ? 'primary.main' : 'divider',
                  borderRadius: 2,
                  bgcolor: logTypeFilter !== 'ALL' ? 'primary.main' + '11' : 'transparent',
                }}
              >
                <FilterListIcon
                  fontSize="small"
                  sx={{ color: logTypeFilter !== 'ALL' ? 'primary.main' : 'inherit' }}
                />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={() => setFilterAnchorEl(null)}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 150,
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                },
              }}
            >
              {['ALL', ...Object.keys(ActionColorMap)].map((type) => (
                <MenuItem
                  key={type}
                  selected={logTypeFilter === type}
                  onClick={() => {
                    setLogTypeFilter(type);
                    setFilterAnchorEl(null);
                  }}
                  sx={{ fontSize: '0.85rem', fontWeight: logTypeFilter === type ? 700 : 500 }}
                >
                  {type.replace('_', ' ')}
                </MenuItem>
              ))}
            </Menu>
            <Tooltip title="Export to CSV">
              <IconButton sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ height: 600, width: '100%', position: 'relative' }}>
          <DataGrid
            rows={filteredLogs}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            initialState={{
              pagination: { paginationModel: { pageSize: 15 } },
            }}
            pageSizeOptions={[15, 25, 50]}
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid',
                borderColor: 'divider',
              },
              '& .MuiDataGrid-columnHeaders': {
                bgcolor:
                  theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                borderBottom: '1px solid',
                borderColor: 'divider',
              },
              '& .MuiDataGrid-row:hover': {
                bgcolor:
                  theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
              },
            }}
            slots={{ loadingOverlay: LinearProgress as any }}
          />
        </Box>
      </MotionPaper>
    </Box>
  );
}
