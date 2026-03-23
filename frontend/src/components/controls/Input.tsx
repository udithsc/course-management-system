import React from 'react';
import { TextField, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

export default function Input({
  name = '',
  label = '',
  value,
  error = null,
  onChange,
  ...other
}: any) {
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
          color: 'text.secondary',
          fontSize: '0.85rem',
          transform: 'translate(14px, 9px) scale(1)', // Center label
          '&.Mui-focused, &.MuiFormLabel-filled': {
            transform: 'translate(14px, -9px) scale(0.85)', // Move up on focus/fill
            color: 'primary.main',
            fontWeight: 600,
          },
        },
        '& .MuiOutlinedInput-input': {
          padding: '8.5px 14px',
          fontSize: '0.9rem',
          color: 'text.primary',
        },
        '& .MuiFormHelperText-root': {
          marginLeft: 0.25,
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
