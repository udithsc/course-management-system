import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Paper, Typography, Avatar, Grid, Divider, Button } from '@mui/material';
import { Person, Email, MobileFriendly } from '@mui/icons-material';
import { selectUser } from '../../store/auth';

export default function Account() {
  const user = useSelector(selectUser);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 4, color: 'text.primary' }}>
        My Account
      </Typography>

      <Paper
        elevation={0}
        sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar
            sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: '3rem', mr: 4 }}
          >
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {user?.name || 'Unknown User'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Role: {user?.role || 'User'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Email color="action" sx={{ mr: 2 }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Email Address
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {user?.email || 'Not provided'}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Person color="action" sx={{ mr: 2 }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Username
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {user?.username || 'Not provided'}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Person color="action" sx={{ mr: 2 }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  First Name
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {user?.firstName || 'Not provided'}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Person color="action" sx={{ mr: 2 }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Last Name
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {user?.lastName || 'Not provided'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" color="primary" sx={{ borderRadius: 2 }}>
            Change Password
          </Button>
          <Button variant="contained" color="primary" sx={{ borderRadius: 2 }}>
            Edit Profile
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
