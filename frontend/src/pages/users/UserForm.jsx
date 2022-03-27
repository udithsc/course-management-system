/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Card, CardMedia } from '@mui/material';
import Joi from 'joi';
import PropTypes from 'prop-types';
import Controls from '../../components/controls/Controls';
import { useForm, Form } from '../../hooks/useForm';

const initialFormValues = {
  id: 0,
  username: '',
  firstName: '',
  lastName: '',
  mobile: 0,
  email: ''
};

const schema = {
  username: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  mobile: Joi.string().required(),
  email: Joi.string().required()
};

export default function UserForm({ recordForEdit, addOrEdit }) {
  const { values, setValues, errors, handleInputChange, resetForm, validate } = useForm(
    initialFormValues,
    schema
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (!formErrors) addOrEdit(values, resetForm);
  };

  useEffect(() => {
    if (recordForEdit) setValues({ ...recordForEdit });
  }, [recordForEdit]);

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container direction="column" sx={{ width: 400 }}>
        <Controls.Input
          name="username"
          label="username"
          value={values.username}
          onChange={handleInputChange}
          error={errors.username}
        />
        <Controls.Input
          name="firstName"
          label="firstName"
          value={values.firstName}
          onChange={handleInputChange}
          error={errors.firstName}
        />
        <Controls.Input
          name="lastName"
          label="lastName"
          value={values.lastName}
          onChange={handleInputChange}
          error={errors.lastName}
        />
        <Controls.Input
          name="mobile"
          label="mobile"
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
      </Grid>
      <Card variant="outlined">
        <CardMedia
          component="img"
          height="200"
          alt="Profile Image"
          src={values.image || '/images/preview.png'}
          sx={{
            objectFit: 'contain'
          }}
        />
      </Card>
      <Grid container justifyContent="flex-end">
        <Controls.Button text="Reset" onClick={resetForm} variant="text" textColor="primary" />
        <Controls.Button type="submit" text="Submit" onClick={() => {}} />
      </Grid>
    </Form>
  );
}

UserForm.propTypes = {
  addOrEdit: PropTypes.func.isRequired,
  recordForEdit: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  })
};

UserForm.defaultProps = {
  recordForEdit: initialFormValues
};
