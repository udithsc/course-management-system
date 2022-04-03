import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Card, CardMedia } from '@mui/material';
import Joi from 'joi';
import PropTypes from 'prop-types';
import { useForm, Form } from '../../hooks/useForm';
import { loadCategories, selectCategoryNames } from '../../store/categories';
import { loadAuthors, selectAuthorsNames } from '../../store/authors';
import Controls from '../../components/controls/Controls';

const initialFormValues = {
  _id: 0,
  name: '',
  description: '',
  author: {
    _id: ''
  },
  category: {
    _id: ''
  },
  fee: ''
};

const schema = {
  name: Joi.string().required(),
  description: Joi.string().required(),
  fee: Joi.number().required()
};

export default function CourseForm({ recordForEdit, addOrEdit }) {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategoryNames);
  const authors = useSelector(selectAuthorsNames);
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
    formData.append('author', values.author._id);
    formData.append('category', values.category._id);
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
      <Grid container>
        <Grid item container direction="column" xs={12} sm={12} md={6}>
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
            options={authors}
            value={values.author._id}
            onChange={(e) => {
              setValues({ ...values, author: { _id: e.target.value } });
            }}
            error={errors.author}
          />
          <Controls.Select
            name="category"
            label="category"
            options={categories}
            value={values.category._id}
            onChange={(e) => {
              setValues({ ...values, category: { _id: e.target.value } });
            }}
            error={errors.category}
          />
        </Grid>
        <Grid item sx={{ flex: 1 }} xs={12} sm={12} md={6}>
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
          <Card variant="outlined" sx={{ ml: 1 }}>
            <CardMedia
              component="img"
              width="100"
              height="200"
              alt="Course Image"
              src={image.preview || values.image || 'images/preview.png'}
              sx={{
                objectFit: 'contain'
              }}
            />
          </Card>
        </Grid>
        <Grid container justifyContent="flex-end">
          <Controls.Button text="Reset" onClick={resetForm} variant="text" textColor="primary" />
          <Controls.Button type="submit" text="Submit" onClick={() => {}} />
        </Grid>
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
