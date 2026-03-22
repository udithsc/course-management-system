import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme, Chip } from '@mui/material';
import Joi from 'joi';
import PropTypes from 'prop-types';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import Controls from '../../components/controls/Controls';
import { useForm, Form } from '../../hooks/useForm';

const initialFormValues = { id: 0, name: '' };
const schema = { name: Joi.string().min(3).max(10).required() };

// Colour presets the user can pick for the category icon
const PRESET_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#F43F5E', '#3B82F6', '#8B5CF6', '#EC4899'];

export default function CategoryForm({ recordForEdit, addOrEdit }) {
  const [image, setImage]   = useState({ preview: '', data: '' });
  const [color, setColor]   = useState(PRESET_COLORS[0]);
  const theme  = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const { values, setValues, errors, handleInputChange, resetForm, validate } = useForm(
    initialFormValues,
    schema
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
    formData.append('file', image.data || values.icon);
    formData.append('name', values.name);
    if (values.id !== 0) formData.append('id', values.id);
    if (!formErrors) addOrEdit(formData, resetForm);
  };

  useEffect(() => {
    if (recordForEdit) setValues({ ...recordForEdit });
  }, [recordForEdit]);

  const previewSrc = image.preview || (values.icon
    ? `${import.meta.env.VITE_API_URL}/files/${values.icon}`
    : null);

  return (
    <Form onSubmit={handleSubmit}>
      {/* Icon preview */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3.5 }}>
        <Box
          sx={{
            width: 80, height: 80, borderRadius: 3.5,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: previewSrc ? 'transparent' : `${color}22`,
            border: `2px solid ${color}44`,
            overflow: 'hidden',
            transition: 'all 0.3s',
          }}
        >
          {previewSrc
            ? <Box component="img" src={previewSrc} alt="Category" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <CategoryOutlinedIcon sx={{ fontSize: 36, color }} />
          }
        </Box>
      </Box>

      <Controls.Input
        name="name"
        label="Category Name"
        value={values.name}
        onChange={handleInputChange}
        error={errors.name}
        InputProps={{ startAdornment: <CategoryOutlinedIcon sx={{ mr: 1, fontSize: 18, color: 'text.disabled' }} /> }}
      />

      {/* Colour picker */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.68rem', display: 'block', mb: 1.25 }}>
          Accent Colour
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {PRESET_COLORS.map((c) => (
            <Box
              key={c}
              onClick={() => setColor(c)}
              sx={{
                width: 30, height: 30, borderRadius: '50%',
                bgcolor: c, cursor: 'pointer',
                border: '3px solid',
                borderColor: color === c ? 'background.paper' : 'transparent',
                outline: color === c ? `2px solid ${c}` : 'none',
                transition: 'all 0.15s',
                transform: color === c ? 'scale(1.15)' : 'scale(1)',
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Icon upload */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.68rem', display: 'block', mb: 1.25 }}>
          Category Icon (optional)
        </Typography>
        <label htmlFor="category-icon-upload">
          <input
            style={{ display: 'none' }}
            accept="image/*"
            id="category-icon-upload"
            type="file"
            name="file"
            onChange={handleFileChange}
          />
          <Box
            sx={{
              height: 80, borderRadius: '12px', cursor: 'pointer',
              border: '2px dashed',
              borderColor: image.preview ? 'primary.main' : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5,
              bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(15,23,42,0.02)',
              transition: 'all 0.2s',
              '&:hover': { borderColor: 'primary.main', bgcolor: isDark ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.04)' },
            }}
          >
            {image.preview
              ? <Chip label="Image selected ✓" color="success" size="small" sx={{ fontWeight: 700 }} />
              : <>
                  <ImageOutlinedIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>Upload icon</Typography>
                </>
            }
          </Box>
        </label>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
        <Controls.Button
          text="Reset"
          onClick={() => { resetForm(); setImage({ preview: '', data: '' }); }}
          variant="outlined"
          sx={{ borderRadius: '10px', fontWeight: 700, px: 3, borderColor: 'divider', color: 'text.secondary' }}
        />
        <Controls.Button
          type="submit"
          text={recordForEdit?.id ? 'Save Changes' : 'Create Category'}
          sx={{
            borderRadius: '10px', fontWeight: 700, px: 3,
            background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
            boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
            '&:hover': { boxShadow: '0 6px 20px rgba(99,102,241,0.5)' },
          }}
        />
      </Box>
    </Form>
  );
}

CategoryForm.propTypes = {
  addOrEdit:     PropTypes.func.isRequired,
  recordForEdit: PropTypes.shape({
    id:   PropTypes.string,
    name: PropTypes.string,
    icon: PropTypes.string,
  }),
};

CategoryForm.defaultProps = { recordForEdit: initialFormValues };
