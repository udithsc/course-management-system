import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  Grid,
  TextField,
  Button,
  CardHeader,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import PropTypes from 'prop-types';
import AddIcon from '@mui/icons-material/Add';
import { red } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Form } from '../../hooks/useForm';
import { loadCourses, removeVideo, selectCourses, uploadVideo } from '../../store/courses';
import Controls from '../../components/controls/Controls';
import Popup from '../../components/ui/Popup';

export default function Videos({ recordForEdit }) {
  const dispatch = useDispatch();
  const courses = useSelector(selectCourses);
  const [video, setVideo] = useState({ preview: '', data: '' });
  const [course, setCourse] = useState({});
  const [data, setData] = useState({ title: '', description: '' });
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [openPopup, setOpenPopup] = useState(false);

  const handleCardClick = (event) => setAnchorEl(event.currentTarget);
  const handleCardClose = () => setAnchorEl(null);

  const resetForm = () => {
    setData({ title: '', description: '' });
    setVideo({ preview: '', data: '' });
    setOpenPopup(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('id', course._id);
    formData.append('videoId', data.id);
    formData.append('file', video.data);
    formData.append('title', data.title);
    formData.append('description', data.description);
    dispatch(uploadVideo(formData));
    resetForm();
    dispatch(loadCourses());
  };

  const handleFileChange = async (e) => {
    setVideo({
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0]
    });
  };

  useEffect(() => {
    const match = courses.find((e) => e._id === recordForEdit._id);
    if (match) setCourse({ ...match });
  }, [courses]);

  return (
    <>
      <Box
        sx={{
          overflow: 'hidden',
          overflowY: 'scroll'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <Controls.Button
            text="Add New Video"
            startIcon={<AddIcon />}
            onClick={() => {
              resetForm();
              setOpenPopup(true);
            }}
          />
        </Box>
        <Grid container spacing={2} sx={{ p: 1 }}>
          {course.lessons &&
            course.lessons.map((item) => (
              <Grid item key={item.id}>
                <Card sx={{ width: 300 }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        R
                      </Avatar>
                    }
                    action={
                      <IconButton aria-label="settings" onClick={handleCardClick}>
                        <MoreVertIcon />
                      </IconButton>
                    }
                    title={item.title}
                    subheader={item.date}
                  />
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={() => handleCardClose()}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button'
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        setOpenPopup(true);
                        setData(item);
                        handleCardClose();
                      }}
                    >
                      Edit
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleCardClose();
                        dispatch(removeVideo(course._id, item.id));
                        dispatch(loadCourses());
                      }}
                    >
                      Delete
                    </MenuItem>
                  </Menu>
                  <CardMedia>
                    <video controls width="100%">
                      <source src={item.url} type="video/mp4" />
                    </video>
                  </CardMedia>
                  <CardContent>
                    <Typography component="span" variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Box>
      {openPopup && (
        <Popup title="Upload Course Video" openPopup={openPopup} setOpenPopup={setOpenPopup}>
          <Form onSubmit={handleSubmit}>
            <Grid container sx={{ width: 400 }} direction="column">
              <TextField
                name="title"
                label="title"
                value={data.title}
                size="small"
                sx={{ mb: 1 }}
                onChange={({ target }) => setData({ ...data, title: target.value })}
              />
              <TextField
                label="description"
                multiline
                size="small"
                value={data.description}
                sx={{ mb: 1 }}
                rows={5}
                onChange={({ target }) => setData({ ...data, description: target.value })}
              />
              <TextField
                name="order"
                label="order"
                value={data.order || course.lessons.findIndex((e) => e.id === data.id) + 1}
                placeholder="video will be added to end if empty"
                size="small"
                onChange={({ target }) => setData({ ...data, order: target.value })}
              />
              <Box sx={{ mt: 1 }}>
                <video controls width="100%">
                  <source src={video.preview || data.url} type="video/mp4" />
                </video>
                <label htmlFor="contained-button-file">
                  <input
                    style={{ display: 'none' }}
                    accept="video/*"
                    id="contained-button-file"
                    multiple
                    type="file"
                    name="file"
                    onChange={handleFileChange}
                  />
                  <Button variant="contained" component="span" fullWidth size="small">
                    Select Video
                  </Button>
                </label>
              </Box>
              <Button type="submit" variant="contained" size="small" sx={{ mt: 2 }}>
                Submit
              </Button>
            </Grid>
          </Form>
        </Popup>
      )}
    </>
  );
}

Videos.propTypes = {
  recordForEdit: PropTypes.shape({
    _id: PropTypes.string.isRequired
  }).isRequired
};
