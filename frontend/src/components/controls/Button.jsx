import React from 'react';
import { Button as MuiButton } from '@mui/material';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';

export default function Button({
  text,
  size,
  variant,
  onClick,
  textColor,
  style,
  tooltip,
  ...other
}) {
  return (
    <Tooltip title={tooltip} disableFocusListener={!tooltip} disableHoverListener={!tooltip}>
      <MuiButton
        sx={{
          m: 1,
          '&.MuiButton-root': {
            color: textColor
          },
          ...style
        }}
        variant={variant}
        size={size}
        onClick={onClick}
        {...other}
      >
        {text}
      </MuiButton>
    </Tooltip>
  );
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
  size: PropTypes.string,
  color: PropTypes.string,
  textColor: PropTypes.string,
  variant: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  style: PropTypes.object,
  tooltip: PropTypes.string
};

Button.defaultProps = {
  size: 'small',
  variant: 'contained',
  color: 'primary',
  textColor: 'white',
  style: {},
  tooltip: ''
};
