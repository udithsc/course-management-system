import React, { useState, useEffect } from 'react';
import { Paper, Toolbar, InputAdornment, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import Controls from '../../components/controls/Controls';
import Popup from '../../components/ui/Popup';
import Notification from '../../components/ui/Notification';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import CategoryForm from './CategoryForm';
import {
  loadCategories,
  deleteCategory,
  selectCategories,
  closeNotification,
  selectNotification,
  addCategory,
  updateCategory,
  selectTotalElements,
  selectRefreshStatus,
} from '../../store/categories';
import Breadcrumbs from '../../components/layout/Breadcrumbs';

export default function Category() {
  const dispatch = useDispatch();
  const records = useSelector(selectCategories);
  const totalRecords = useSelector(selectTotalElements);
  const notify = useSelector(selectNotification);
  const refresh = useSelector(selectRefreshStatus);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [openPopup, setOpenPopup] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    subTitle: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: '',
    subTitle: '',
  });

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'createdAt', headerName: 'Date Created', flex: 1 },
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
    if (record.has('id')) dispatch(updateCategory(record));
    else dispatch(addCategory(record));

    resetForm();
    setRecordForEdit(null);
    setOpenPopup(false);
  };

  const onDelete = (id) => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    dispatch(deleteCategory(id));
  };

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };

  useEffect(() => {
    dispatch(loadCategories(paginationModel.page, paginationModel.pageSize, searchText));
  }, [paginationModel.page, paginationModel.pageSize, searchText, refresh]);

  return (
    <>
      <Breadcrumbs />
      <Paper sx={{ mt: 2, p: 2 }}>
        <Toolbar
          sx={{
            p: 1,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Controls.Input
            sx={{
              width: 320,
              '& .Mui-focused': { width: 350 },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            value={searchText}
            placeholder="Search..."
            onChange={({ target: input }) => {
              setSearchText(input.value);
            }}
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
        title={recordForEdit ? 'Edit Category' : 'New Category'}
        subtitle="Organise your courses into structured topics"
        icon={<CategoryOutlinedIcon fontSize="small" />}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <CategoryForm recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
      </Popup>
      {notify.isOpen && <Notification notify={notify} closeNotification={closeNotification} />}
      {confirmDialog.isOpen && (
        <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
      )}
    </>
  );
}
