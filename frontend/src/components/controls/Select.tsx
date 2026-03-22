import React from 'react';
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  FormHelperText,
  useTheme,
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';

export default function Select({
  name,
  label,
  value,
  error,
  onChange,
  options,
  tooltip,
  readOnly,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Tooltip title={tooltip} disableFocusListener={!tooltip} disableHoverListener={!tooltip}>
      <FormControl variant="outlined" size="small" fullWidth error={Boolean(error)} sx={{ mb: 2 }}>
        <InputLabel
          sx={{
            fontSize: '0.875rem',
            '&.Mui-focused': { color: 'primary.main' },
          }}
        >
          {label}
        </InputLabel>
        <MuiSelect
          label={label}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          fullWidth
          defaultValue=""
          inputProps={{ readOnly }}
          sx={{
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
            fontSize: '0.9rem',
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                borderRadius: '12px',
                mt: 0.5,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: isDark
                  ? '0 16px 40px rgba(0,0,0,0.5)'
                  : '0 16px 40px rgba(15,23,42,0.12)',
                bgcolor: 'background.paper',
                backgroundImage: 'none',
                '& .MuiMenuItem-root': {
                  borderRadius: '8px',
                  mx: 0.75,
                  my: 0.2,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  '&:hover': { bgcolor: 'rgba(99,102,241,0.1)', color: 'primary.main' },
                  '&.Mui-selected': {
                    bgcolor: 'rgba(99,102,241,0.12)',
                    color: 'primary.main',
                    fontWeight: 700,
                    '&:hover': { bgcolor: 'rgba(99,102,241,0.18)' },
                  },
                },
              },
            },
          }}
        >
          {options.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.title}
            </MenuItem>
          ))}
        </MuiSelect>
        {error && (
          <FormHelperText sx={{ mt: 0.5, ml: 0.25, fontSize: '0.75rem' }}>{error}</FormHelperText>
        )}
      </FormControl>
    </Tooltip>
  );
}

Select.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  error: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string.isRequired,
    }),
  ).isRequired,
  readOnly: PropTypes.bool,
  tooltip: PropTypes.string,
};

Select.defaultProps = {
  error: '',
  value: '',
  onChange: () => {},
  readOnly: false,
  tooltip: '',
};
