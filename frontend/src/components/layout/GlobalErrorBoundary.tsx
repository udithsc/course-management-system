import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

function ErrorFallback({ error, resetErrorBoundary }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper
        elevation={0}
        sx={{
          p: 5,
          textAlign: 'center',
          borderRadius: 4,
          bgcolor: 'background.default',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Oops! Something went wrong.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {error.message || 'An unexpected error occurred while rendering this page.'}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="outlined" onClick={() => (window.location.href = '/')}>
            Go to Home
          </Button>
          <Button variant="contained" color="primary" onClick={resetErrorBoundary}>
            Try Again
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

const logErrorToServices = (error, info) => {
  // Here, we could easily send the error to Sentry, Datadog or an API endpoint.
  console.error('Caught by Error Boundary:', error, info);
};

export default function GlobalErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={logErrorToServices}
      onReset={() => {
        // Reset state here if any logic is tightly bound to App
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
