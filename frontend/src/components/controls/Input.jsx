import React from 'react';
import { TextField, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

export default function Input({ name, label, value, error, onChange, ...other }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <TextField
      variant="outlined"
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      size="small"
      fullWidth
      {...other}
      {...(error && { error: true, helperText: error })}
      sx={{
        mb: 2,
        '& .MuiOutlinedInput-root': {
          borderRadius: '10px',
          backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.025)',
          transition: 'all 0.2s',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
          },
          '&.Mui-focused': {
            backgroundColor: isDark ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.04)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
            borderWidth: '2px',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.12)',
          },
        },
        '& .MuiInputLabel-root': {
          fontSize: '0.875rem',
          '&.Mui-focused': { color: 'primary.main' },
        },
        '& .MuiInputBase-input': {
          fontSize: '0.9rem',
          py: 1.1,
        },
        '& .MuiFormHelperText-root': {
          mt: 0.5,
          ml: 0.25,
          fontSize: '0.75rem',
        },
        ...other.sx,
      }}
    />
  );
}

Input.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  error: PropTypes.string,
};

Input.defaultProps = {
  name: '',
  label: '',
  value: '',
  error: '',
  onChange: () => {},
};
