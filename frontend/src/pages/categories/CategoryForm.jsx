import React, { useEffect, useState } from 'react';
import { Grid, Card, CardMedia } from '@mui/material';
import Joi from 'joi';
import PropTypes from 'prop-types';
import Controls from '../../components/controls/Controls';
import { useForm, Form } from '../../hooks/useForm';

const initialFormValues = {
  _id: 0,
  name: ''
};

const schema = {
  name: Joi.string().min(3).max(10).required()
};

export default function CategoryForm({ recordForEdit, addOrEdit }) {
  const [image, setImage] = useState({ preview: '', data: '' });
  const { values, setValues, errors, handleInputChange, resetForm, validate } = useForm(
    initialFormValues,
    schema
  );

  const handleFileChange = async (e) => {
    e.preventDefault();
    setImage({
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validate();

    const formData = new FormData();
    formData.append('file', image.data || values.icon);
    formData.append('name', values.name);

    if (values._id !== 0) formData.append('id', values._id);

    if (!formErrors) addOrEdit(formData, resetForm);
  };

  useEffect(() => {
    if (recordForEdit) setValues({ ...recordForEdit });
  }, [recordForEdit]);

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container direction="column" sx={{ width: 400 }}>
        <Controls.Input
          name="name"
          label="Category name"
          value={values.name}
          onChange={handleInputChange}
          error={errors.name}
        />
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
            text="Upload Icon"
            onClick={() => {}}
          />
        </label>
        <Card variant="outlined">
          <CardMedia
            component="img"
            width="100"
            height="200"
            alt="profile image"
            src={image.preview || values.icon || '/images/preview.png'}
            sx={{
              objectFit: 'contain'
            }}
          />
        </Card>
        <Grid container justifyContent="flex-end">
          <Controls.Button text="Reset" onClick={resetForm} variant="text" textColor="primary" />
          <Controls.Button type="submit" text="Submit" onClick={() => {}} />
        </Grid>
      </Grid>
    </Form>
  );
}

CategoryForm.propTypes = {
  addOrEdit: PropTypes.func.isRequired,
  recordForEdit: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string
  })
};

CategoryForm.defaultProps = {
  recordForEdit: initialFormValues
};
