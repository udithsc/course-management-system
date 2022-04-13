import React, { useState, useEffect } from 'react';
import { Paper, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import useTable from '../../hooks/useTable';
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
  selectTotalElements
} from '../../store/users';
import UserForm from './UserForm';
import Breadcrumbs from '../../components/controls/Breadcrumbs';

const headCells = [
  { id: 'username', label: 'Username', width: '15%' },
  { id: 'fisrtName', label: 'First Name', width: '20%' },
  { id: 'lastName', label: 'Last Name', width: '20%' },
  { id: 'mobile', label: 'Mobile ', width: '15%' },
  { id: 'email', label: 'Email', width: '20%' },
  { id: 'actions', label: 'Actions', disableSorting: true, align: 'center', width: '10%' }
];

export default function User() {
  const dispatch = useDispatch();
  const records = useSelector(selectUsers);
  const totalRecords = useSelector(selectTotalElements);
  const notify = useSelector(selectNotification);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [openPopup, setOpenPopup] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    subTitle: ''
  });

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting, page, rowsPerPage } =
    useTable(records, headCells, totalRecords);

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

  useEffect(() => {
    dispatch(loadUsers(page, rowsPerPage, searchText));
  }, [page, rowsPerPage, searchText]);

  return (
    <>
      <Breadcrumbs />
      <Paper sx={{ mt: 2, p: 2 }}>
        <Toolbar
          sx={{
            p: 1,
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Controls.Input
            sx={{
              width: 320,
              '& .Mui-focused': { width: 350 }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
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
        <TblContainer>
          <TblHead />
          <TableBody>
            {records.length <= rowsPerPage &&
              recordsAfterPagingAndSorting().map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.username}</TableCell>
                  <TableCell>{item.firstName}</TableCell>
                  <TableCell>{item.lastName}</TableCell>
                  <TableCell>{item.mobile}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell align="center">
                    <Controls.ActionButton
                      color="primary.light"
                      onClick={() => {
                        openInPopup(item);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </Controls.ActionButton>
                    <Controls.ActionButton
                      color="error.main"
                      onClick={() => {
                        setConfirmDialog({
                          isOpen: true,
                          title: 'Are you sure to delete this record?',
                          subTitle: "You can't undo this operation",
                          onConfirm: () => {
                            onDelete(item._id);
                          }
                        });
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </Controls.ActionButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </TblContainer>
        {records && <TblPagination />}
      </Paper>
      {openPopup && (
        <Popup title="Setup Charges" openPopup={openPopup} setOpenPopup={setOpenPopup}>
          <UserForm recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
        </Popup>
      )}
      {notify.isOpen && <Notification notify={notify} closeNotification={closeNotification} />}
      {confirmDialog.isOpen && (
        <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
      )}
    </>
  );
}
