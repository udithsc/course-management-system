import React, { useState, useEffect } from 'react';
import { Paper, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import PhotoIcon from '@mui/icons-material/Photo';
import Breadcrumbs from '../../components/controls/Breadcrumbs';
import useTable from '../../hooks/useTable';
import Controls from '../../components/controls/Controls';
import Popup from '../../components/ui/Popup';
import Notification from '../../components/ui/Notification';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import {
  loadCourses,
  selectCourses,
  selectNotification,
  addCourse,
  updateCourse,
  deleteCourse,
  closeNotification,
  selectTotalElements,
  selectRefreshStatus
} from '../../store/courses';
import CourseForm from './CourseForm';
import VideoManager from './VideoManager';
import ImageManager from './ImageManager';

const headCells = [
  { id: 'name', label: 'Name', width: '20%' },
  { id: 'description', label: 'Information', width: '20%' },
  { id: 'fee', label: 'Fee', width: '10%' },
  { id: 'subscriptions', label: 'subscriptions', width: '10%' },
  { id: 'category', label: 'Category', width: '10%' },
  { id: 'actions', label: 'Actions', disableSorting: true, width: '10%' }
];

export default function Course() {
  const dispatch = useDispatch();
  const records = useSelector(selectCourses);
  const notify = useSelector(selectNotification);
  const totalRecords = useSelector(selectTotalElements);
  const refresh = useSelector(selectRefreshStatus);
  const [searchText, setSearchText] = useState('');
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [openVideoPopup, setOpenVideoPopup] = useState(false);
  const [openImagePopup, setOpenImagePopup] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    subTitle: ''
  });

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting, page, rowsPerPage } =
    useTable(records, headCells, totalRecords);

  const addOrEdit = (record, resetForm) => {
    if (record.has('id')) dispatch(updateCourse(record));
    else dispatch(addCourse(record));
    resetForm();
    setRecordForEdit(null);
    setOpenPopup(false);
  };

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };

  const openInVideoPopup = (item) => {
    setRecordForEdit(item);
    setOpenVideoPopup(true);
  };

  const openInImagePopup = (item) => {
    setRecordForEdit(item);
    setOpenImagePopup(true);
  };

  const onDelete = (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    });
    dispatch(deleteCourse(id));
  };

  useEffect(() => {
    dispatch(loadCourses(page, rowsPerPage, searchText));
  }, [page, rowsPerPage, searchText, refresh]);

  return (
    <>
      <Breadcrumbs path="Courses" label="Courses" />
      <Paper sx={{ m: 2, p: 2 }}>
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
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.fee}</TableCell>
                  <TableCell>{item.subscriptions}</TableCell>
                  <TableCell>{item.category.name}</TableCell>
                  <TableCell>
                    <Controls.ActionButton
                      color="primary.light"
                      onClick={() => {
                        openInPopup(item);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </Controls.ActionButton>
                    <Controls.ActionButton
                      color="secondary.light"
                      onClick={() => {
                        openInVideoPopup(item);
                      }}
                    >
                      <VideoCameraBackIcon fontSize="small" />
                    </Controls.ActionButton>
                    <Controls.ActionButton
                      color="secondary.main"
                      onClick={() => {
                        openInImagePopup(item);
                      }}
                    >
                      <PhotoIcon fontSize="small" />
                    </Controls.ActionButton>
                    <Controls.ActionButton
                      color="error.main"
                      onClick={() => {
                        setConfirmDialog({
                          isOpen: true,
                          title: 'Are you sure to delete this record?',
                          subTitle: "You can't undo this operation",
                          onConfirm: () => onDelete(item._id)
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
        <Popup title="Setup Courses" openPopup={openPopup} setOpenPopup={setOpenPopup}>
          <CourseForm recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
        </Popup>
      )}
      {openVideoPopup && (
        <Popup
          title="Setup Course Videos"
          openPopup={openVideoPopup}
          setOpenPopup={setOpenVideoPopup}
        >
          <VideoManager recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
        </Popup>
      )}
      {openImagePopup && (
        <Popup
          title="Setup Course Images"
          openPopup={openImagePopup}
          setOpenPopup={setOpenImagePopup}
        >
          <ImageManager recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
        </Popup>
      )}
      {notify.isOpen && <Notification notify={notify} closeNotification={closeNotification} />}
      {confirmDialog.isOpen && (
        <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
      )}
    </>
  );
}
