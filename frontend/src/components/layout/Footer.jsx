import React from 'react';
import { Box, Container } from '@mui/material';
import Copyright from './Copyright';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        backgroundColor: 'transparent',
        borderTop: '1px solid rgba(0,0,0,0.05)',
        mt: 'auto',
      }}
    >
      <Container maxWidth="sm">
        <Copyright />
      </Container>
    </Box>
  );
}

export default Footer;
