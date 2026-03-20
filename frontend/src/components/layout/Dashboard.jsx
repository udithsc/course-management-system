import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Box, Toolbar } from '@mui/material';
import { motion } from 'framer-motion';
import Footer from './Footer';
import SideBar from './SideBar';
import Header from './Header';

function DashboardContent() {
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => setOpen(!open);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative background elements */}
      <Box
        component={motion.div}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        sx={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, rgba(79, 70, 229, 0) 70%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <Box
        component={motion.div}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        sx={{
          position: 'absolute',
          bottom: '-150px',
          left: '-150px',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0) 70%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <Header open={open} toggleDrawer={toggleDrawer} />
      <SideBar open={open} />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          zIndex: 1,
          position: 'relative',
        }}
      >
        <Toolbar />
        <Container 
          maxWidth={false} 
          sx={{ 
            flex: 1, 
            mt: 4, 
            mb: 4,
            px: { xs: 2, sm: 3, md: 4 },
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.05)',
              borderRadius: '10px',
            },
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>
        </Container>
        <Footer />
      </Box>
    </Box>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
