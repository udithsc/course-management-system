import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Card, Grid, TextField, Button, CardContent, IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import CancelIcon from '@mui/icons-material/Cancel';
import { Form } from '../../hooks/useForm';
import { removeVideo, selectCourses, uploadVideo } from '../../store/courses';
import Controls from '../../components/controls/Controls';

export default function VideoManager({ recordForEdit }) {
  const dispatch = useDispatch();
  const courses = useSelector(selectCourses);
  const [video, setVideo] = useState({ preview: '', data: '' });
  const [course, setCourse] = useState({});
  const [data, setData] = useState({ title: '', description: '' });

  const resetForm = () => {
    setData({ title: '', description: '' });
    setVideo({ preview: '', data: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('id', course._id);
    formData.append('file', video.data);
    formData.append('title', data.title);
    formData.append('description', data.description);
    dispatch(uploadVideo(formData));

    resetForm();
  };

  const handleFileChange = async (e) => {
    e.preventDefault();
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
    <Form onSubmit={handleSubmit}>
      <Grid container>
        <Grid container item direction="column" xs={6} sx={{ pr: 1, mb: 1 }}>
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
            maxRows={4}
            size="small"
            value={data.description}
            sx={{ mb: 1 }}
            rows={5}
            onChange={({ target }) => setData({ ...data, description: target.value })}
          />
          <Button type="submit" variant="contained" size="small">
            Submit
          </Button>
        </Grid>
        <Grid container item direction="row" xs={6} spacing={1}>
          <Grid item xs={6}>
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
              <Button variant="contained" component="span" fullWidth>
                Upload Video
              </Button>
            </label>
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="order"
              label="order"
              value={data.order}
              placeholder="video will be added to end if empty"
              size="small"
              onChange={({ target }) => setData({ ...data, order: target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <Card
              variant="outlined"
              sx={{
                display: 'flex'
              }}
            >
              <video controls width="100%">
                <source src={video.preview} type="video/mp4" />
              </video>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <hr style={{ height: '5px', backgroundColor: 'gray' }} />
      <Box
        sx={{
          overflow: 'hidden',
          overflowY: 'scroll',
          borderRadius: 2
        }}
      >
        {course.lessons &&
          course.lessons.map((item, i) => (
            <Card
              key={item.id}
              variant="outlined"
              sx={{
                display: 'flex',
                width: '100%',
                justifyContent: 'start',
                mt: 1
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <CardContent>
                  <TextField
                    name="title"
                    label="title"
                    value={item.title}
                    size="small"
                    sx={{ mb: 1 }}
                    fullWidth
                    readOnly
                  />
                  <TextField
                    label="description"
                    multiline
                    maxRows={4}
                    size="small"
                    value={item.description}
                    fullWidth
                    readOnly
                  />
                </CardContent>
              </Box>
              <Box>
                <video controls width="250" style={{ marginTop: '20px' }}>
                  <source src={item.url} type="video/mp4" />
                </video>
              </Box>
              <Box sx={{ display: 'flex', alignSelf: 'flex-start' }}>
                <IconButton
                  aria-label="settings"
                  onClick={() => {
                    dispatch(removeVideo(course._id, item.id));
                  }}
                >
                  <CancelIcon />
                </IconButton>
              </Box>
            </Card>
          ))}
      </Box>
    </Form>
  );
}

VideoManager.propTypes = {
  recordForEdit: PropTypes.shape({
    _id: PropTypes.string.isRequired
  }).isRequired
};
