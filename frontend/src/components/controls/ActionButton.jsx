import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

export default function ActionButton({ color, children, onClick, style, tooltip }) {
  return (
    <Tooltip title={tooltip}>
      <IconButton
        sx={{
          mr: 1,
          backgroundColor: color,
          color: 'white',
          '&:hover': { backgroundColor: color },
          ...style
        }}
        onClick={onClick}
        size="small"
      >
        {children}
      </IconButton>
    </Tooltip>
  );
}

ActionButton.propTypes = {
  color: PropTypes.string,
  children: PropTypes.element.isRequired,
  onClick: PropTypes.func.isRequired,
  style: PropTypes.object,
  tooltip: PropTypes.string
};

ActionButton.defaultProps = {
  color: 'primary.main',
  tooltip: '',
  style: {}
};
