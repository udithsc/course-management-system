import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

function NotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}
    >
      <Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="sm">
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" component="h4" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          The Requested Page was not found
        </Typography>
      </Container>
    </Box>
  );
}

export default NotFound;
