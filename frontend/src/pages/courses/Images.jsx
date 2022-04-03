import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardMedia,
  Grid,
  Typography,
  TextField,
  Button,
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
  IconButton,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import PropTypes from 'prop-types';
import { red } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Form } from '../../hooks/useForm';
import { createAddon, loadCourses, removeAddon, selectCourses } from '../../store/courses';
import Controls from '../../components/controls/Controls';
import Popup from '../../components/ui/Popup';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest
  })
}));

export default function Images({ recordForEdit }) {
  const dispatch = useDispatch();
  const courses = useSelector(selectCourses);
  const [image, setImage] = useState({ preview: '', data: '' });
  const [course, setCourse] = useState({});
  const [data, setData] = useState({
    title: '',
    description: ''
  });
  const [expanded, setExpanded] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleExpandClick = () => setExpanded(!expanded);
  const handleCardClick = (event) => setAnchorEl(event.currentTarget);
  const handleCardClose = () => setAnchorEl(null);

  const resetForm = () => {
    setData({ title: '', description: '' });
    setImage({ preview: '', data: '' });
    setOpenPopup(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('id', course._id);
    formData.append('file', image.data);
    formData.append('title', data.title);
    formData.append('description', data.description);
    dispatch(createAddon(formData));
    resetForm();
    dispatch(loadCourses());
  };

  const handleFileChange = async (e) => {
    setImage({
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
        style={{
          overflow: 'hidden',
          overflowY: 'scroll'
        }}
      >
        <Controls.Button
          text="Add New Video"
          startIcon={<AddIcon />}
          onClick={() => setOpenPopup(true)}
        />
        <Grid container spacing={2} sx={{ p: 1 }}>
          {course.addons &&
            course.addons.map((item) => (
              <Grid item key={item.id}>
                <Card variant="outlined" sx={{ width: 300 }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        R
                      </Avatar>
                    }
                    action={
                      <IconButton aria-label="settings">
                        <MoreVertIcon onClick={handleCardClick} />
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
                        dispatch(removeAddon(course._id, item.id));
                        dispatch(loadCourses());
                      }}
                    >
                      Delete
                    </MenuItem>
                  </Menu>
                  <CardMedia
                    component="img"
                    height="194"
                    image={item.image || '/images/preview.png'}
                    alt="Paella dish"
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                    <ExpandMore
                      expand={expanded}
                      onClick={handleExpandClick}
                      aria-expanded={expanded}
                      aria-label="show more"
                    >
                      <ExpandMoreIcon />
                    </ExpandMore>
                  </CardActions>
                  <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                      {item.contents.length >= 1 &&
                        item.contents.map((item) => (
                          <CardMedia
                            key={item.id}
                            component="img"
                            width="100"
                            height="150"
                            image={item.image || '/images/preview.png'}
                            sx={{
                              mb: 1,
                              objectFit: 'contain'
                            }}
                          />
                        ))}
                    </CardContent>
                  </Collapse>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Box>
      {openPopup && (
        <Popup title="Upload Course Images" openPopup={openPopup} setOpenPopup={setOpenPopup}>
          <Form onSubmit={handleSubmit}>
            <Grid container direction="column" sx={{ width: 400 }}>
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
                rows={4}
                size="small"
                sx={{ mb: 1 }}
                value={data.description}
                onChange={({ target }) => setData({ ...data, description: target.value })}
              />

              <Box sx={{ mb: 1 }}>
                <Card variant="outlined">
                  <CardMedia
                    component="img"
                    width="100"
                    height="155"
                    alt="Addon Image"
                    src={image.preview || '/images/preview.png'}
                    sx={{
                      objectFit: 'contain'
                    }}
                  />
                </Card>
                <label htmlFor="contained-button-file">
                  <input
                    style={{ display: 'none' }}
                    accept="image/*"
                    id="contained-button-file"
                    multiple
                    type="file"
                    name="file"
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="contained"
                    component="span"
                    fullWidth
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    Upload Image
                  </Button>
                </label>
              </Box>
              <Button type="submit" variant="contained" size="small">
                Submit
              </Button>
            </Grid>
          </Form>
        </Popup>
      )}
    </>
  );
}

Images.propTypes = {
  recordForEdit: PropTypes.shape({
    _id: PropTypes.string.isRequired
  }).isRequired
};
