import React from 'react';
import Link from '@mui/material/Link';
import { Typography } from '@mui/material';
import configData from '../../data.json';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href={configData.BRAND_WEBSITE} target="_blank">
        {configData.BRAND_NAME}
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  );
}

export default Copyright;
