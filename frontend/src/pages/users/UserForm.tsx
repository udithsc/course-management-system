/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import Joi from 'joi';
import PropTypes from 'prop-types';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import Controls from '../../components/controls/Controls';
import { useForm, Form } from '../../hooks/useForm';

const initialFormValues = {
  id: 0,
  username: '',
  firstName: '',
  lastName: '',
  mobile: 0,
  email: '',
};

const schema = {
  username: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  mobile: Joi.string().required(),
  email: Joi.string().required(),
};

export default function UserForm({ recordForEdit, addOrEdit }) {
  const { values, setValues, errors, handleInputChange, resetForm, validate } = useForm(
    initialFormValues,
    schema,
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
      <Grid container spacing={0}>
        <Grid item xs={12} sm={6} sx={{ pr: { sm: 1 } }}>
          <Controls.Input
            name="firstName"
            label="First Name"
            value={values.firstName}
            onChange={handleInputChange}
            error={errors.firstName}
            InputProps={{
              startAdornment: (
                <PersonOutlinedIcon sx={{ mr: 1, fontSize: 18, color: 'text.disabled' }} />
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{ pl: { sm: 1 } }}>
          <Controls.Input
            name="lastName"
            label="Last Name"
            value={values.lastName}
            onChange={handleInputChange}
            error={errors.lastName}
          />
        </Grid>
      </Grid>

      <Controls.Input
        name="username"
        label="Username"
        value={values.username}
        onChange={handleInputChange}
        error={errors.username}
        InputProps={{
          startAdornment: (
            <BadgeOutlinedIcon sx={{ mr: 1, fontSize: 18, color: 'text.disabled' }} />
          ),
        }}
      />
      <Controls.Input
        name="email"
        label="Email Address"
        value={values.email}
        onChange={handleInputChange}
        error={errors.email}
        InputProps={{
          startAdornment: (
            <EmailOutlinedIcon sx={{ mr: 1, fontSize: 18, color: 'text.disabled' }} />
          ),
        }}
      />
      <Controls.Input
        name="mobile"
        label="Mobile Number"
        value={values.mobile}
        onChange={handleInputChange}
        error={errors.mobile}
        InputProps={{
          startAdornment: (
            <PhoneOutlinedIcon sx={{ mr: 1, fontSize: 18, color: 'text.disabled' }} />
          ),
        }}
      />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 1.5,
          mt: 1,
          pt: 3,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Controls.Button
          text="Reset"
          onClick={resetForm}
          variant="outlined"
          sx={{
            borderRadius: '10px',
            fontWeight: 700,
            px: 3,
            borderColor: 'divider',
            color: 'text.secondary',
          }}
        />
        <Controls.Button
          type="submit"
          text={recordForEdit?.id ? 'Save Changes' : 'Add User'}
          sx={{
            borderRadius: '10px',
            fontWeight: 700,
            px: 3,
            background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
            boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
            '&:hover': { boxShadow: '0 6px 20px rgba(99,102,241,0.5)' },
          }}
        />
      </Box>
    </Form>
  );
}

UserForm.propTypes = {
  addOrEdit: PropTypes.func.isRequired,
  recordForEdit: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
  }),
};

UserForm.defaultProps = { recordForEdit: initialFormValues };
