import React from 'react';
import { FormControl, FormControlLabel, Checkbox as MuiCheckbox } from '@mui/material';
import PropTypes from 'prop-types';

export default function Checkbox(props) {
  const { name, label, value, onChange } = props;

  const convertToDefEventPara = (nameField, valueField) => ({
    target: {
      nameField,
      valueField
    }
  });

  return (
    <FormControl>
      <FormControlLabel
        control={
          <MuiCheckbox
            name={name}
            color="primary"
            checked={value}
            onChange={(e) => onChange(convertToDefEventPara(name, e.target.checked))}
          />
        }
        label={label}
      />
    </FormControl>
  );
}

Checkbox.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};
