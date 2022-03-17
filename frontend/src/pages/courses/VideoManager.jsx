import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  TextareaAutosize,
  Grid,
  Typography,
  TextField,
  Button,
  CardContent,
  IconButton
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import CancelIcon from '@mui/icons-material/Cancel';
import { Form } from '../../hooks/useForm';
import { removeVideo, selectCourses, uploadVideo } from '../../store/courses';

export default function VideoManager({ recordForEdit }) {
  const dispatch = useDispatch();
  const courses = useSelector(selectCourses);
  const [video, setVideo] = useState({ preview: '', data: '' });
  const [course, setCourse] = useState({});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('id', course._id);
    formData.append('file', video.data);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('videoNo', course.lessons.length + 1);
    dispatch(uploadVideo(formData));
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
      <Grid container direction="column">
        <Grid container>
          <Grid container item direction="column" xs={6} sx={{ pr: 2 }}>
            <TextField
              name="title"
              label="title"
              value={title}
              size="small"
              sx={{ mb: 2 }}
              onChange={({ target }) => setTitle(target.value)}
            />
            <TextareaAutosize
              minRows={7}
              aria-label="empty textarea"
              placeholder="Empty"
              onChange={({ target }) => setDescription(target.value)}
            />
            <Button type="submit" variant="contained" sx={{ mt: 2, mb: 2 }}>
              Submit
            </Button>
          </Grid>
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
              <Button variant="contained" component="span" sx={{ mb: 2 }}>
                Select Video
              </Button>
            </label>
            {video.preview && (
              <Card
                variant="outlined"
                sx={{
                  display: 'flex',
                  p: 1
                }}
              >
                <video controls width="250">
                  <source src={video.preview} type="video/mp4" />
                </video>
              </Card>
            )}
          </Grid>
        </Grid>
        <Box
          sx={{ height: 400, width: 600, border: 1, p: 2, mb: 2 }}
          style={{
            overflow: 'hidden',
            overflowY: 'scroll' // added scroll
          }}
        >
          <DragDropContext
            onDragEnd={(param) => {
              const srcI = param.source.index;
              const desI = param.destination?.index;
              if (desI) {
                course.lessons.splice(desI, 0, course.lessons.splice(srcI, 1)[0]);
              }
            }}
          >
            <Grid container direction="column" spacing={2}>
              <Droppable droppableId="droppable-1">
                {(provided, _) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {course.lessons &&
                      course.lessons.map((item, i) => (
                        <Draggable
                          key={item.videoNo}
                          draggableId={`draggable-${item.videoNo}`}
                          index={i}
                        >
                          {(provided, snapshot) => (
                            <Grid
                              item
                              container
                              key={item.videoNo}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                boxShadow: snapshot.isDragging ? '0 0 .4rem #666' : 'none'
                              }}
                            >
                              <Card
                                variant="outlined"
                                sx={{
                                  display: 'flex',
                                  width: '100%',
                                  justifyContent: 'start',
                                  p: 1,
                                  m: 1
                                }}
                              >
                                <Box>
                                  <video controls width="250">
                                    <source src={item.url} type="video/mp4" />
                                  </video>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                  <CardContent>
                                    <Typography component="div" variant="h5">
                                      {item.title}
                                    </Typography>
                                    <Typography
                                      variant="subtitle1"
                                      color="text.secondary"
                                      component="div"
                                    >
                                      {item.description}
                                    </Typography>
                                  </CardContent>
                                </Box>
                                <Box sx={{ display: 'flex', alignSelf: 'flex-start' }}>
                                  <IconButton
                                    aria-label="settings"
                                    onClick={() => {
                                      dispatch(removeVideo(course._id, item.videoNo));
                                      console.log(course._id, item.videoNo);
                                    }}
                                  >
                                    <CancelIcon />
                                  </IconButton>
                                </Box>
                              </Card>
                            </Grid>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Grid>
          </DragDropContext>
        </Box>
      </Grid>
    </Form>
  );
}

VideoManager.propTypes = {
  recordForEdit: PropTypes.shape({
    _id: PropTypes.string.isRequired
  }).isRequired
};
