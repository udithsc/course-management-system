import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Box, Toolbar } from '@mui/material';
import Footer from './Footer';
import SideBar from './SideBar';
import Header from './Header';

function DashboardContent() {
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => setOpen(!open);

  return (
    <Box sx={{ display: 'flex' }}>
      <Header open={open} toggleDrawer={toggleDrawer} />
      <SideBar open={open} />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) => theme.palette.grey[100],
          display: 'flex',
          flexGrow: 1,
          flexDirection: 'column',
          height: '100vh',
          overflow: 'auto'
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ flex: 1, mt: 4 }}>
          <Outlet />
        </Container>
        <Footer />
      </Box>
    </Box>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
