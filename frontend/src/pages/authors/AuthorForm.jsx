import React, { useEffect, useState } from 'react';
import { Grid, Card, CardMedia } from '@mui/material';
import Joi from 'joi';
import PropTypes from 'prop-types';
import Controls from '../../components/controls/Controls';
import { useForm, Form } from '../../hooks/useForm';

const initialFormValues = {
  _id: 0,
  name: '',
  profession: '',
  mobile: '',
  email: '',
  image: ''
};

const schema = {
  name: Joi.string().min(3).max(50).required(),
  profession: Joi.string().min(3).max(20).required(),
  mobile: Joi.number().required(),
  email: Joi.string().required()
};

export default function UserForm({ recordForEdit, addOrEdit }) {
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
    formData.append('file', image.data || values.image);
    formData.append('name', values.name);
    formData.append('profession', values.profession);
    formData.append('mobile', values.mobile);
    formData.append('email', values.email);
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
          label="name"
          value={values.name}
          onChange={handleInputChange}
          error={errors.name}
        />
        <Controls.Input
          name="profession"
          label="profession"
          value={values.profession}
          onChange={handleInputChange}
          error={errors.profession}
        />
        <Controls.Input
          name="mobile"
          label="mobile"
          type="number"
          value={values.mobile}
          onChange={handleInputChange}
          error={errors.mobile}
        />
        <Controls.Input
          name="email"
          label="email"
          value={values.email}
          onChange={handleInputChange}
          error={errors.email}
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
            text="Upload Image"
            onClick={() => {}}
          />
        </label>
        <Card variant="outlined">
          <CardMedia
            component="img"
            width="100"
            height="200"
            alt="Category Icon"
            src={image.preview || values.image || '/images/preview.png'}
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

UserForm.propTypes = {
  addOrEdit: PropTypes.func.isRequired,
  recordForEdit: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    profession: PropTypes.string.isRequired,
    mobile: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired
  })
};

UserForm.defaultProps = {
  recordForEdit: initialFormValues
};
