import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import Joi from 'joi';
import PropTypes from 'prop-types';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import Controls from '../../components/controls/Controls';
import { useForm, Form } from '../../hooks/useForm';

const initialFormValues = {
  id: 0,
  name: '',
  profession: '',
  mobile: '',
  email: '',
  image: '',
};

const schema = {
  name: Joi.string().min(3).max(50).required(),
  profession: Joi.string().min(3).max(20).required(),
  mobile: Joi.number().required(),
  email: Joi.string().required(),
};

export default function AuthorForm({ recordForEdit, addOrEdit }) {
  const [image, setImage] = useState({ preview: '', data: '' });
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const { values, setValues, errors, handleInputChange, resetForm, validate } = useForm(
    initialFormValues,
    schema,
  );

  const handleFileChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;
    setImage({ preview: URL.createObjectURL(file), data: file });
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
    if (values.id !== 0) formData.append('id', values.id);
    if (!formErrors) addOrEdit(formData, resetForm);
  };

  useEffect(() => {
    if (recordForEdit) setValues({ ...recordForEdit });
  }, [recordForEdit]);

  const previewSrc =
    image.preview ||
    (values.image ? `${import.meta.env.VITE_API_URL}/files/${values.image}` : null);

  return (
    <Form onSubmit={handleSubmit}>
      {/* Avatar upload */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <label htmlFor="author-image-upload" style={{ cursor: 'pointer' }}>
          <input
            style={{ display: 'none' }}
            accept="image/*"
            id="author-image-upload"
            type="file"
            name="file"
            onChange={handleFileChange}
          />
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <Box
              sx={{
                width: 90,
                height: 90,
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid',
                borderColor: previewSrc ? 'primary.main' : 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: isDark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.07)',
                transition: 'all 0.2s',
                '&:hover': { borderColor: 'primary.main' },
              }}
            >
              {previewSrc ? (
                <Box
                  component="img"
                  src={previewSrc}
                  alt="Author"
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <PersonOutlinedIcon sx={{ fontSize: 36, color: 'primary.main', opacity: 0.6 }} />
              )}
            </Box>
            {/* Camera overlay */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366F1, #10B981)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(99,102,241,0.4)',
                border: '2px solid',
                borderColor: 'background.paper',
              }}
            >
              <CloudUploadOutlinedIcon sx={{ fontSize: 13, color: 'white' }} />
            </Box>
          </Box>
        </label>
      </Box>

      <Typography
        variant="caption"
        fontWeight={700}
        color="text.secondary"
        sx={{ textAlign: 'center', display: 'block', mb: 2.5, fontSize: '0.72rem' }}
      >
        Click avatar to change photo
      </Typography>

      <Controls.Input
        name="name"
        label="Full Name"
        value={values.name}
        onChange={handleInputChange}
        error={errors.name}
        InputProps={{
          startAdornment: (
            <PersonOutlinedIcon sx={{ mr: 1, fontSize: 18, color: 'text.disabled' }} />
          ),
        }}
      />
      <Controls.Input
        name="profession"
        label="Profession / Title"
        value={values.profession}
        onChange={handleInputChange}
        error={errors.profession}
        InputProps={{
          startAdornment: <WorkOutlineIcon sx={{ mr: 1, fontSize: 18, color: 'text.disabled' }} />,
        }}
      />
      <Controls.Input
        name="mobile"
        label="Mobile Number"
        type="number"
        value={values.mobile}
        onChange={handleInputChange}
        error={errors.mobile}
        InputProps={{
          startAdornment: (
            <PhoneOutlinedIcon sx={{ mr: 1, fontSize: 18, color: 'text.disabled' }} />
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
          text={recordForEdit?.id ? 'Save Changes' : 'Add Instructor'}
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

AuthorForm.propTypes = {
  addOrEdit: PropTypes.func.isRequired,
  recordForEdit: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    profession: PropTypes.string,
    mobile: PropTypes.number,
    email: PropTypes.string,
  }),
};

AuthorForm.defaultProps = { recordForEdit: initialFormValues };
