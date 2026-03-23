import React, { useState, useEffect } from 'react';
import {
  Paper,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
  Box,
  Typography,
  Chip,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import Controls from '../../components/controls/Controls';
import Popup from '../../components/ui/Popup';
import Notification from '../../components/ui/Notification';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import {
  loadUsers,
  addUser,
  updateUser,
  deleteUser,
  selectUsers,
  closeNotification,
  selectNotification,
  selectTotalElements,
  selectRefreshStatus,
} from '../../store/users';
import UserForm from './UserForm';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import { motion } from 'framer-motion';

const ROLE_CONFIG = {
  ADMIN: {
    label: 'Admin',
    color: '#6366F1',
    icon: <AdminPanelSettingsIcon sx={{ fontSize: 14 }} />,
  },
  INSTRUCTOR: { label: 'Instructor', color: '#10B981', icon: <SchoolIcon sx={{ fontSize: 14 }} /> },
  STUDENT: { label: 'Student', color: '#3B82F6', icon: <PersonIcon sx={{ fontSize: 14 }} /> },
};

function RoleChip({ role }) {
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.STUDENT;
  return (
    <Chip
      icon={cfg.icon}
      label={cfg.label}
      size="small"
      sx={{
        bgcolor: `${cfg.color}18`,
        color: cfg.color,
        fontWeight: 700,
        borderRadius: '6px',
        '& .MuiChip-icon': { color: cfg.color },
      }}
    />
  );
}

function RoleSelect({ userId, currentRole, onChanged }) {
  const [val, setVal] = useState(currentRole || 'STUDENT');
  const [busy, setBusy] = useState(false);

  const handleChange = async (e) => {
    const newRole = e.target.value;
    setVal(newRole);
    setBusy(true);
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/users/${userId}/role`, { role: newRole });
      onChanged?.(userId, newRole);
    } catch (err) {
      console.error('Role update failed', err);
      setVal(currentRole); // revert on failure
    } finally {
      setBusy(false);
    }
  };

  return (
    <FormControl size="small" disabled={busy}>
      <Select
        value={val}
        onChange={handleChange}
        sx={{
          fontSize: '0.78rem',
          fontWeight: 700,
          borderRadius: '8px',
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: `${(ROLE_CONFIG[val] || ROLE_CONFIG.STUDENT).color}44`,
          },
          color: (ROLE_CONFIG[val] || ROLE_CONFIG.STUDENT).color,
        }}
      >
        {Object.entries(ROLE_CONFIG).map(([k, v]) => (
          <MenuItem key={k} value={k} sx={{ fontSize: '0.82rem', fontWeight: 700, color: v.color }}>
            {v.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default function User() {
  const dispatch = useDispatch();
  const records = useSelector(selectUsers);
  const totalRecords = useSelector(selectTotalElements);
  const notify = useSelector(selectNotification);
  const refresh = useSelector(selectRefreshStatus);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [openPopup, setOpenPopup] = useState(false);
  const [localRoles, setLocalRoles] = useState({});
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    subTitle: string;
    onConfirm?: () => void;
  }>({ isOpen: false, title: '', subTitle: '' });

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const columns: GridColDef[] = [
    {
      field: 'username',
      headerName: 'Username',
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
          {params.row.username}
        </Typography>
      ),
    },
    { field: 'firstName', headerName: 'First Name', flex: 1 },
    { field: 'lastName', headerName: 'Last Name', flex: 1 },
    { field: 'mobile', headerName: 'Mobile', width: 130 },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1.5,
      renderCell: (params) => (
        <Chip label={params.row.email} size="small" variant="outlined" sx={{ borderRadius: 2 }} />
      ),
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <RoleSelect
          userId={params.row.id}
          currentRole={localRoles[params.row.id] || params.row.role || 'STUDENT'}
          onChanged={handleRoleChanged}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      align: 'center',
      renderCell: (params) => (
        <Box display="flex" justifyContent="center">
          <Controls.ActionButton color="primary.light" onClick={() => openInPopup(params.row)}>
            <EditIcon fontSize="small" />
          </Controls.ActionButton>
          <Controls.ActionButton
            color="error.main"
            onClick={() =>
              setConfirmDialog({
                isOpen: true,
                title: 'Are you sure to delete this record?',
                subTitle: "You can't undo this operation",
                onConfirm: () => onDelete(params.row.id),
              })
            }
          >
            <CloseIcon fontSize="small" />
          </Controls.ActionButton>
        </Box>
      ),
    },
  ];

  const addOrEdit = (record, resetForm) => {
    if (record.id === 0) dispatch(addUser(record));
    else dispatch(updateUser(record));
    resetForm();
    setRecordForEdit(null);
    setOpenPopup(false);
  };

  const onDelete = (id) => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    dispatch(deleteUser(id));
  };

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };

  const handleRoleChanged = (userId, newRole) => {
    setLocalRoles((prev) => ({ ...prev, [userId]: newRole }));
  };

  useEffect(() => {
    dispatch(loadUsers(paginationModel.page, paginationModel.pageSize, searchText));
  }, [paginationModel.page, paginationModel.pageSize, searchText, refresh]);

  return (
    <>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom sx={{ color: 'text.primary' }}>
            User Management
          </Typography>
          <Breadcrumbs />
        </Box>
        {/* Role legend */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {Object.values(ROLE_CONFIG).map((cfg) => (
            <Chip
              key={cfg.label}
              icon={cfg.icon}
              label={cfg.label}
              size="small"
              sx={{
                bgcolor: `${cfg.color}12`,
                color: cfg.color,
                fontWeight: 700,
                borderRadius: '6px',
                '& .MuiChip-icon': { color: cfg.color },
              }}
            />
          ))}
        </Box>
      </Box>

      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        elevation={0}
        sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}
      >
        <Toolbar sx={{ p: 1, display: 'flex', justifyContent: 'space-between' }}>
          <Controls.Input
            sx={{ width: 320, '& .Mui-focused': { width: 350 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            value={searchText}
            placeholder="Search by name..."
            onChange={({ target: input }) => setSearchText(input.value)}
          />
          <Controls.Button
            text="Add New"
            startIcon={<AddIcon />}
            onClick={() => {
              setOpenPopup(true);
              setRecordForEdit(null);
            }}
          />
        </Toolbar>

        <Box sx={{ height: 600, width: '100%', mt: 2 }}>
          <DataGrid
            rows={records || []}
            columns={columns}
            paginationMode="server"
            rowCount={totalRecords || 0}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
            disableColumnMenu
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid',
                borderColor: 'divider',
              },
              '& .MuiDataGrid-columnHeaders': {
                borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
              },
            }}
          />
        </Box>
      </Paper>

      <Popup
        title={recordForEdit ? 'Edit User' : 'New User'}
        subtitle="Add a new user account to the platform"
        icon={<GroupOutlinedIcon fontSize="small" />}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UserForm recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
      </Popup>

      {notify.isOpen && <Notification notify={notify} closeNotification={closeNotification} />}
      {confirmDialog.isOpen && (
        <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
      )}
    </>
  );
}
