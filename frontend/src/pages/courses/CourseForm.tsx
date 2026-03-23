import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Box, Typography, Avatar, useTheme } from '@mui/material';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loadCategories, selectCategoryNames } from '../../store/categories';
import { loadAuthors, selectAuthorsNames } from '../../store/authors';
import Controls from '../../components/controls/Controls';

const initialFormValues = {
  id: 0,
  name: '',
  description: '',
  author: {},
  category: {},
  fee: '',
};

const schema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  name: z.string().min(1, 'Course Name is required'),
  description: z.string().min(1, 'Description is required'),
  fee: z.union([z.string().min(1, 'Fee is required'), z.number()]),
  author: z.object({ id: z.union([z.string(), z.number()]).optional() }).optional(),
  category: z.object({ id: z.union([z.string(), z.number()]).optional() }).optional(),
  image: z.any().optional(),
});

export default function CourseForm({ recordForEdit, addOrEdit }) {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategoryNames);
  const authors = useSelector(selectAuthorsNames);
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

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('file', image.data);
    formData.append('name', data.name);
    formData.append('description', data.description);
    if (data.author?.id) formData.append('author', data.author.id);
    if (data.category?.id) formData.append('category', data.category.id);
    formData.append('fee', data.fee);
    if (data.id && data.id !== 0) formData.append('id', data.id);
    addOrEdit(formData, () => reset(initialFormValues));
  };

  const handleFileChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;
    setImage({ preview: URL.createObjectURL(file), data: file });
  };

  useEffect(() => {
    dispatch(loadAuthors());
    dispatch(loadCategories());
    if (recordForEdit) reset(recordForEdit);
    else reset(initialFormValues);
  }, [recordForEdit, reset]);

  const previewSrc =
    image.preview || watch('image')
      ? image.preview || `${import.meta.env.VITE_API_URL}/files/${watch('image')}`
      : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        {/* Left column: fields */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Controls.Input
                {...field}
                label="Course Name"
                error={errors.name?.message}
                InputProps={{
                  startAdornment: (
                    <SchoolOutlinedIcon sx={{ mr: 1, fontSize: 18, color: 'text.disabled' }} />
                  ),
                }}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Controls.Input
                {...field}
                label="Description"
                error={errors.description?.message}
                multiline
                rows={3}
                InputProps={{
                  startAdornment: (
                    <DescriptionOutlinedIcon
                      sx={{
                        mr: 1,
                        mt: 0.5,
                        fontSize: 18,
                        color: 'text.disabled',
                        alignSelf: 'flex-start',
                      }}
                    />
                  ),
                }}
              />
            )}
          />
          <Controller
            name="fee"
            control={control}
            render={({ field }) => (
              <Controls.Input
                {...field}
                label="Course Fee (USD)"
                type="number"
                error={errors.fee?.message}
                InputProps={{
                  startAdornment: (
                    <AttachMoneyIcon sx={{ mr: 0.5, fontSize: 18, color: 'text.disabled' }} />
                  ),
                }}
              />
            )}
          />
          <Controller
            name="author"
            control={control}
            render={({ field }) => (
              <Controls.Select
                {...field}
                label="Instructor"
                options={authors}
                value={field.value?.id ?? ''}
                onChange={(e) => field.onChange({ id: e.target.value })}
                error={(errors.author as any)?.id?.message as string}
              />
            )}
          />
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Controls.Select
                {...field}
                label="Category"
                options={categories}
                value={field.value?.id ?? ''}
                onChange={(e) => field.onChange({ id: e.target.value })}
                error={(errors.category as any)?.id?.message as string}
              />
            )}
          />
        </Grid>

        {/* Right column: image upload */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography
            variant="caption"
            fontWeight={700}
            color="text.secondary"
            sx={{
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontSize: '0.68rem',
              display: 'block',
              mb: 1.5,
            }}
          >
            Cover Image
          </Typography>

          {/* Upload zone */}
          <label htmlFor="course-image-upload">
            <input
              style={{ display: 'none' }}
              accept="image/*"
              id="course-image-upload"
              type="file"
              name="file"
              onChange={handleFileChange}
            />
            <Box
              sx={{
                position: 'relative',
                borderRadius: '14px',
                overflow: 'hidden',
                height: 180,
                cursor: 'pointer',
                border: '2px dashed',
                borderColor: image.preview
                  ? 'primary.main'
                  : isDark
                    ? 'rgba(255,255,255,0.12)'
                    : 'rgba(15,23,42,0.14)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(15,23,42,0.02)',
                transition: 'all 0.25s',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.05)',
                },
              }}
            >
              {previewSrc ? (
                <Box
                  component="img"
                  src={previewSrc}
                  alt="Preview"
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <>
                  <Box
                    sx={{
                      mb: 1.5,
                      p: 1.5,
                      borderRadius: '50%',
                      bgcolor: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)',
                    }}
                  >
                    <CloudUploadOutlinedIcon sx={{ fontSize: 28, color: 'primary.main' }} />
                  </Box>
                  <Typography variant="body2" fontWeight={700} color="primary.main">
                    Click to upload
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    PNG, JPG up to 5MB
                  </Typography>
                </>
              )}

              {/* Hover overlay if image exists */}
              {previewSrc && (
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    '&:hover': { opacity: 1 },
                  }}
                >
                  <CloudUploadOutlinedIcon sx={{ color: 'white', fontSize: 28, mb: 0.5 }} />
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 700 }}>
                    Change image
                  </Typography>
                </Box>
              )}
            </Box>
          </label>
        </Grid>
      </Grid>

      {/* Footer actions */}
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
            '&:hover': { borderColor: 'text.secondary' },
          }}
        />
        <Controls.Button
          type="submit"
          text={recordForEdit?.id ? 'Save Changes' : 'Create Course'}
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
