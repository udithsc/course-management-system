import React from 'react';
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  FormHelperText
} from '@mui/material';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';

export default function Select({
  name,
  label,
  value,
  error,
  onChange,
  options,
  tooltip,
  readOnly
}) {
  return (
    <Tooltip title={tooltip} disableFocusListener={!tooltip} disableHoverListener={!tooltip}>
      <FormControl
        sx={{
          m: 1,
          minWidth: 100,
          flex: 1,
          '& .MuiInputBase-root': {
            backgroundColor: 'white'
          }
        }}
        variant="outlined"
        {...(error && { error: true })}
      >
        <InputLabel>{label}</InputLabel>
        <MuiSelect
          label={label}
          name={name}
          value={value}
          onChange={onChange}
          size="small"
          fullWidth
          defaultValue=""
          inputProps={{ readOnly }}
        >
          {options.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.title}
            </MenuItem>
          ))}
        </MuiSelect>
        {error && <FormHelperText>{error}</FormHelperText>}
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
      title: PropTypes.string.isRequired
    })
  ).isRequired,
  readOnly: PropTypes.bool,
  tooltip: PropTypes.string
};

Select.defaultProps = {
  error: '',
  value: '',
  onChange: () => {},
  readOnly: false,
  tooltip: ''
};
