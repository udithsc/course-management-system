import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Paper, Breadcrumbs } from '@mui/material';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useDispatch } from 'react-redux';
import CourseForm from './CourseForm';
import Videos from './Videos';
import Images from './Images';
import Reviews from './Reviews';
import Subscribers from './Subscribers';
import { updateCourse } from '../../store/courses';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="span">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

function CourseManager() {
  const [value, setValue] = React.useState(0);
  const { state: recordForEdit } = useLocation();
  const dispatch = useDispatch();

  const addOrEdit = (record) => {
    if (record.has('id')) dispatch(updateCourse(record));
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Paper sx={{ mt: 2, p: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Course Details" {...a11yProps(0)} />
          <Tab label="Videos" {...a11yProps(1)} />
          <Tab label="Images" {...a11yProps(2)} />
          <Tab label="Reviews" {...a11yProps(3)} />
          <Tab label="Subscribers" {...a11yProps(4)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <CourseForm recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Videos recordForEdit={recordForEdit} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Images recordForEdit={recordForEdit} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Reviews recordForEdit={recordForEdit} />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <Subscribers recordForEdit={recordForEdit} />
      </TabPanel>
    </Paper>
  );
}

export default CourseManager;
