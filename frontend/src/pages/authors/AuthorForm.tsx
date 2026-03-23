import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import Controls from '../../components/controls/Controls';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const initialFormValues = {
  id: 0,
  name: '',
  profession: '',
  mobile: '',
  email: '',
  image: '',
};

const schema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  name: z.string().min(3, 'Name must be at least 3 characters').max(50, 'Name max length 50'),
  profession: z.string().min(3, 'Profession must be at least 3 characters').max(50),
  mobile: z.union([z.string().min(1, 'Mobile is required'), z.number()]),
  email: z.string().email('Invalid email'),
  image: z.any().optional(),
});

export default function AuthorForm({ recordForEdit, addOrEdit }) {
  const [image, setImage] = useState({ preview: '', data: '' });
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: recordForEdit || initialFormValues,
  });

  const handleFileChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;
    setImage({ preview: URL.createObjectURL(file), data: file });
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('file', image.data || data.image);
    formData.append('name', data.name);
    formData.append('profession', data.profession);
    formData.append('mobile', data.mobile);
    formData.append('email', data.email);
    if (data.id && data.id !== 0) formData.append('id', data.id);
    addOrEdit(formData, () => reset(initialFormValues));
  };

  useEffect(() => {
    if (recordForEdit) reset(recordForEdit);
    else reset(initialFormValues);
  }, [recordForEdit, reset]);

  const previewSrc =
    image.preview ||
    (watch('image') ? `${import.meta.env.VITE_API_URL}/files/${watch('image')}` : null);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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

      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Controls.Input
            {...field}
            label="Full Name"
            error={errors.name?.message}
            InputProps={{
              startAdornment: (
                <PersonOutlinedIcon sx={{ mr: 1, fontSize: 18, color: 'text.disabled' }} />
              ),
            }}
          />
        )}
      />
      <Controller
        name="profession"
        control={control}
        render={({ field }) => (
          <Controls.Input
            {...field}
            label="Profession / Title"
            error={errors.profession?.message}
            InputProps={{
              startAdornment: (
                <WorkOutlineIcon sx={{ mr: 1, fontSize: 18, color: 'text.disabled' }} />
              ),
            }}
          />
        )}
      />
      <Controller
        name="mobile"
        control={control}
        render={({ field }) => (
          <Controls.Input
            {...field}
            label="Mobile Number"
            type="number"
            error={errors.mobile?.message}
            InputProps={{
              startAdornment: (
                <PhoneOutlinedIcon sx={{ mr: 1, fontSize: 18, color: 'text.disabled' }} />
              ),
            }}
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <Controls.Input
            {...field}
            label="Email Address"
            error={errors.email?.message}
            InputProps={{
              startAdornment: (
                <EmailOutlinedIcon sx={{ mr: 1, fontSize: 18, color: 'text.disabled' }} />
              ),
            }}
          />
        )}
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
          onClick={() => {
            reset(initialFormValues);
            setImage({ preview: '', data: '' });
          }}
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
    </form>
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
