import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Rating,
  Card,
  CardMedia
} from '@mui/material';
import Joi from 'joi';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DataGrid } from '@mui/x-data-grid';
import { useForm, Form } from '../../hooks/useForm';
import { loadCategories, selectCategories } from '../../store/categories';
import { loadAuthors, selectAuthors } from '../../store/authors';
import Controls from '../../components/controls/Controls';

const initialFormValues = {
  _id: 0,
  name: '',
  description: '',
  author: '',
  category: '',
  fee: ''
};

const schema = {
  name: Joi.string().required(),
  description: Joi.string().required(),
  fee: Joi.number().required(),
  author: Joi.string().required(),
  category: Joi.string().required()
};

export default function CourseForm({ recordForEdit, addOrEdit }) {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const authors = useSelector(selectAuthors);
  const [image, setImage] = useState({ preview: '', data: '' });

  const { values, setValues, errors, setErrors, handleInputChange, resetForm, validate } = useForm(
    initialFormValues,
    schema
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    setErrors({ ...errors });

    const formData = new FormData();
    formData.append('file', image.data);
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('author', values.author);
    formData.append('category', values.category);
    formData.append('fee', values.fee);
    if (values._id !== 0) formData.append('id', values._id);
    if (!errors) addOrEdit(formData, resetForm);
  };

  const handleFileChange = async (e) => {
    e.preventDefault();
    setImage({
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0]
    });
  };

  useEffect(() => {
    dispatch(loadAuthors());
    dispatch(loadCategories());
    if (recordForEdit) setValues({ ...recordForEdit });
  }, [recordForEdit]);

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container sx={{ mb: 2, width: 700 }}>
        <Grid item container direction="column" xs={6}>
          <Controls.Input
            name="name"
            label="name"
            value={values.name}
            onChange={handleInputChange}
            error={errors.name}
          />
          <Controls.Input
            name="description"
            label="description"
            value={values.description}
            onChange={handleInputChange}
            error={errors.description}
          />
          <Controls.Input
            name="fee"
            label="fee"
            type="number"
            value={values.fee}
            onChange={handleInputChange}
            error={errors.fee}
          />
          <Controls.Select
            name="author"
            label="author"
            options={authors.map((a) => ({ id: a._id, title: a.name }))}
            value={values.author._id || values.author}
            onChange={handleInputChange}
            error={errors.author}
          />
          <Controls.Select
            name="category"
            label="category"
            options={categories.map((c) => ({ id: c._id, title: c.name }))}
            value={values.category._id || values.category}
            onChange={handleInputChange}
            error={errors.category}
          />
        </Grid>
        <Grid item sx={{ flex: 1 }}>
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
            <Controls.Button
              variant="contained"
              component="span"
              text="Upload Cover Image"
              onClick={() => {}}
            />
          </label>
          <Card
            variant="outlined"
            sx={{
              p: 1,
              ml: 1
            }}
          >
            <CardMedia
              component="img"
              width="100"
              height="200"
              alt="Category Icon"
              src={image.preview || values.image || 'images/preview.png'}
              sx={{
                objectFit: 'contain'
              }}
            />
          </Card>
        </Grid>
      </Grid>
      {values.reviews && (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>Ratings</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                '& > legend': { mt: 2 }
              }}
            >
              <Box>
                <Typography component="legend">
                  Overall Rating:
                  {values.reviews.reduce((p, c) => p.value + c.value, 0) / values.reviews.length}
                </Typography>
                <Rating
                  name="read-only"
                  value={
                    values.reviews.reduce((p, c) => p.value + c.value, 0) / values.reviews.length
                  }
                  readOnly
                />
              </Box>
              <Typography component="legend">User Ratings:</Typography>
              {values.review && (
                <div style={{ height: 400, width: '100%' }}>
                  <DataGrid
                    rows={values.review}
                    columns={[
                      { field: 'id', headerName: 'ID', width: 70 },
                      { field: 'user', headerName: 'user', width: 100 },
                      {
                        field: 'review',
                        headerName: 'review',
                        width: 100,
                        renderCell: (params) => <Rating readOnly value={params.value} />
                      },
                      { field: 'comment', headerName: 'comment', width: 300 }
                    ]}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                  />
                </div>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
      {values.tokens && (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>Tokens</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {values.tokens && (
              <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={values.tokens}
                  columns={[
                    { field: 'id', headerName: 'ID', width: 70 },
                    { field: 'token', headerName: 'Token', width: 150 },
                    { field: 'user', headerName: 'User', width: 150 }
                  ]}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                />
              </div>
            )}
          </AccordionDetails>
        </Accordion>
      )}
      <Grid container justifyContent="flex-end">
        <Controls.Button text="Reset" onClick={resetForm} variant="text" textColor="primary" />
        <Controls.Button type="submit" text="Submit" onClick={() => {}} />
      </Grid>
    </Form>
  );
}

CourseForm.propTypes = {
  addOrEdit: PropTypes.func.isRequired,
  recordForEdit: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    fee: PropTypes.number.isRequired
  })
};

CourseForm.defaultProps = {
  recordForEdit: initialFormValues
};
