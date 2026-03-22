import React, { useState, useEffect } from 'react';
import { Paper, TableBody, TableRow, TableCell, Toolbar, InputAdornment, Box, Typography, Chip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import useTable from '../../hooks/useTable';
import Controls from '../../components/controls/Controls';
import Popup from '../../components/ui/Popup';
import Notification from '../../components/ui/Notification';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import CourseForm from './CourseForm';
import {
  loadCourses,
  selectCourses,
  selectNotification,
  addCourse,
  updateCourse,
  deleteCourse,
  closeNotification,
  selectTotalElements
} from '../../store/courses';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import { motion } from 'framer-motion';

const headCells = [
  { id: 'name', label: 'Name', width: '20%' },
  { id: 'description', label: 'Information', width: '20%' },
  { id: 'fee', label: 'Fee', width: '10%' },
  { id: 'subscriptions', label: 'subscriptions', width: '10%' },
  { id: 'category', label: 'Category', width: '10%' },
  { id: 'actions', label: 'Actions', disableSorting: true, align: 'center', width: '10%' }
];

export default function Course() {
  const dispatch = useDispatch();
  const records = useSelector(selectCourses);
  const notify = useSelector(selectNotification);
  const navigate = useNavigate();
  const totalRecords = useSelector(selectTotalElements);
  const [searchText, setSearchText] = useState('');
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
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

  const onDelete = (id) => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    dispatch(deleteCourse(id));
  };

  useEffect(() => {
    dispatch(loadCourses(page, rowsPerPage, searchText));
  }, [page, rowsPerPage, searchText]);

  return (
    <>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom sx={{ color: 'text.primary' }}>
            Course Catalog
          </Typography>
          <Breadcrumbs />
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
                <TableRow key={item.id}>
                  <TableCell sx={{ fontWeight: 600 }}>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>$ {item.fee}</TableCell>
                  <TableCell>{item.subscriptions}</TableCell>
                  <TableCell>
                    <Chip label={item.category.name} size="small" variant="filled" color="primary" sx={{ borderRadius: 2 }} />
                  </TableCell>
                  <TableCell align="center">
                    <Controls.ActionButton
                      color="primary.light"
                      onClick={() => {
                        navigate(`/courses/courses/${item.id}`, { state: item });
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
                          onConfirm: () => onDelete(item.id)
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
      <Popup
        title={recordForEdit ? 'Edit Course' : 'New Course'}
        subtitle="Fill in the details below to publish a new course"
        icon={<SchoolOutlinedIcon fontSize="small" />}
        maxWidth="md"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <CourseForm recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
      </Popup>
      {notify.isOpen && <Notification notify={notify} closeNotification={closeNotification} />}
      {confirmDialog.isOpen && (
        <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
      )}
    </>
  );
}
