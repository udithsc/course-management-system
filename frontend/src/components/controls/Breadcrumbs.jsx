import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import Link from '@mui/material/Link';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import PropTypes from 'prop-types';

function handleClick(event) {
  event.preventDefault();
}

export default function Breadcrumbs({ path, label }) {
  return (
    <div role="presentation" onClick={handleClick}>
      <MuiBreadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
          color="inherit"
          href="/"
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Dashboard
        </Link>
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
          color="inherit"
          href={path}
        >
          <WhatshotIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          {label}
        </Link>
      </MuiBreadcrumbs>
    </div>
  );
}

Breadcrumbs.propTypes = {
  path: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};
